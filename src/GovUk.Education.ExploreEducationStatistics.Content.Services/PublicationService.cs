#nullable enable
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Common.Utils;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Services.ViewModels;
using Lunr;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using static GovUk.Education.ExploreEducationStatistics.Common.BlobContainers;
using Index = Lunr.Index;

namespace GovUk.Education.ExploreEducationStatistics.Content.Services;

public class PublicationService : IPublicationService
{
    private readonly ContentDbContext _contentDbContext;
    private readonly IPersistenceHelper<ContentDbContext> _contentPersistenceHelper;
    private readonly IBlobStorageService _blobStorageService;

    public PublicationService(ContentDbContext contentDbContext,
        IPersistenceHelper<ContentDbContext> contentPersistenceHelper,
        IBlobStorageService blobStorageService)
    {
        _contentDbContext = contentDbContext;
        _contentPersistenceHelper = contentPersistenceHelper;
        _blobStorageService = blobStorageService;
    }

    public async Task<Either<ActionResult, PublicationCacheViewModel>> Get(string publicationSlug)
    {
        return await _contentPersistenceHelper
            .CheckEntityExists<Publication>(query => query
                .Include(p => p.Releases)
                .Include(p => p.Contact)
                .Include(p => p.LegacyReleases)
                .Include(p => p.Topic)
                .ThenInclude(topic => topic.Theme)
                .Where(p => p.Slug == publicationSlug))
            .OnSuccessCombineWith(GetLatestRelease)
            .OnSuccess(async tuple =>
            {
                var (publication, latestRelease) = tuple;
                return await BuildPublicationViewModel(publication, latestRelease);
            });
    }

    public async Task<Either<ActionResult, List<FindStatsPublicationViewModel>>> GetPublications(
        ReleaseType? releaseType,
        string? searchTerm,
        int page,
        int pageSize,
        FindStatsSortBy sortBy,
        FindStatsSortOrder sortOrder)
    {
        // TODO we wouldn't update the index on every request!
        // Adding this here to make sure it's populated for testing
        var ignored = await UpdatePublicationIndex();

        using var stream = new MemoryStream();
        await _blobStorageService.DownloadToStream(PublicContent, "publications.json", stream);
        var index = await Index.LoadFromJsonStream(stream);

        // This isn't too clever because if there's no search term we're just using the text index to filter by release type
        // and if there's no release type we're just using the text index to bring back all publications
        var query = string.IsNullOrEmpty(searchTerm) ? "" : $"title:{searchTerm} summary:{searchTerm})";

        if (releaseType.HasValue)
        {
            query += $" +releaseType:{releaseType.ToString()}";
        }

        var results = await index.Search(query).ToList();

        var scores = results.ToDictionary(
            r => Guid.Parse(r.DocumentReference),
            r => r.Score
            );

        if (sortBy == FindStatsSortBy.Relevance)
        {
            var resultIdsOrderedEnumerable = sortOrder == FindStatsSortOrder.Asc
                ? results.OrderBy(r => r.Score)
                : results.OrderByDescending(r => r.Score);

            // Apply offset pagination to the id's
            var position = page < 0 ? 0 : (page-1) * pageSize;
            var resultIdsPaginatedEnumerable = resultIdsOrderedEnumerable
                .Skip(position)
                .Take(pageSize)
                .Select(result => Guid.Parse(result.DocumentReference));

            // Lunr only returns ref's/scores
            // Fetch the publications and relevant release details from the database
            var dbResults = await _contentDbContext.Publications
                .Include(p => p.Topic)
                .ThenInclude(t => t.Theme)
                .Where(p => resultIdsPaginatedEnumerable.Contains(p.Id))
                .Select(p => new FindStatsPublicationViewModel
                {
                    Id = p.Id,
                    Title = p.Title,
                    Summary = p.Summary,
                    Theme = p.Topic.Theme.Title,
                    LastPublished = null, // TODO same problem getting these as with the database-only solution!
                    ReleaseType = null,
                    Score = scores[p.Id]
                })
                .ToListAsync();

            return (sortOrder == FindStatsSortOrder.Asc
                    ? dbResults.OrderBy(r => r.Score)
                    : dbResults.OrderByDescending(r => r.Score))
                .ToList();
        }
        else
        {
            var resultIds = scores.Keys.ToList();

            // Lunr only returns ref's/scores so fetch the publications and relevant release details from the database
            var dbResults = await _contentDbContext.Publications
                .Include(p => p.Topic)
                .ThenInclude(t => t.Theme)
                .Where(p => resultIds.Contains(p.Id))
                .Select(p => new FindStatsPublicationViewModel
                {
                    Id = p.Id,
                    Title = p.Title,
                    Summary = p.Summary,
                    Theme = p.Topic.Theme.Title,
                    LastPublished = null, // TODO same problem getting these as with the database-only solution!
                    ReleaseType = null,
                    Score = scores[p.Id]
                })
                .ToListAsync();

            // TODO will also need to cater for sorting by date last published
            return (sortOrder == FindStatsSortOrder.Asc
                    ? dbResults.OrderBy(r => r.Title)
                    : dbResults.OrderByDescending(r => r.Title))
                .ToList();
        }
    }

    public async Task<Index> UpdatePublicationIndex()
    {
        var publications = _contentDbContext.Publications
            .Include(p => p.Releases)
            .Where(p => p.LegacyPublicationUrl != null ||
                        p.Releases.Any(r =>
                            r.Published.HasValue && DateTime.UtcNow >= r.Published.Value
                                                 && !r.Publication.Releases.Any(r2 =>
                                                     r2.Published.HasValue && DateTime.UtcNow >= r2.Published.Value
                                                                           && r.Id == r2.PreviousVersionId
                                                                           && r.Id != r2.Id)))
            .Select(publication => new Document
            {
                { "id", publication.Id.ToString() },
                { "title", publication.Title },
                { "summary", publication.Summary },
                { "releaseType", ReleaseType.NationalStatistics.ToString() }, // TODO
            })
            .ToAsyncEnumerable();

        var index = await Index.Build(async builder =>
        {
            builder
                .AddField("id")
                .AddField("title")
                .AddField("summary")
                .AddField("releaseType");

            await publications.ForEachAwaitAsync(async document =>
            {
                await builder.Add(document);
            });
        });

        // Serialize the index
        using var stream = new MemoryStream();
        await index.SaveToJsonStream(stream);

        // Upload the index to blob storage
        await _blobStorageService.UploadStream(PublicContent, "publications.json", stream, MediaTypeNames.Application.Json);

        return index;
    }

    private static Either<ActionResult, Release> GetLatestRelease(Publication publication)
    {
        return publication.LatestPublishedRelease() ?? new Either<ActionResult, Release>(new NotFoundResult());
    }

    private async Task<PublicationCacheViewModel> BuildPublicationViewModel(Publication publication, Release latestRelease)
    {
        return new PublicationCacheViewModel
        {
            Id = publication.Id,
            Title = publication.Title,
            Slug = publication.Slug,
            LegacyReleases = publication.LegacyReleases
                .OrderByDescending(legacyRelease => legacyRelease.Order)
                .Select(legacyRelease => new LegacyReleaseViewModel(legacyRelease))
                .ToList(),
            Topic = new TopicViewModel(new ThemeViewModel(publication.Topic.Theme.Title)),
            Contact = new ContactViewModel(publication.Contact),
            ExternalMethodology = publication.ExternalMethodology != null
                ? new ExternalMethodologyViewModel(publication.ExternalMethodology)
                : null,
            LatestReleaseId = latestRelease.Id,
            IsSuperseded = await IsSuperseded(publication),
            Releases = ListPublishedReleases(publication)
        };
    }

    private static List<ReleaseTitleViewModel> ListPublishedReleases(Publication publication)
    {
        return publication.GetPublishedReleases()
            .OrderByDescending(release => release.Year)
            .ThenByDescending(release => release.TimePeriodCoverage)
            .Select(release => new ReleaseTitleViewModel
            {
                Id = release.Id,
                Slug = release.Slug,
                Title = release.Title
            })
            .ToList();
    }

    private async Task<bool> IsSuperseded(Publication publication)
    {
        return publication.SupersededById != null
               // To be superseded, superseding publication must have Live release
               && await _contentDbContext.Releases
                   .AnyAsync(r => r.PublicationId == publication.SupersededById
                                  && r.Published.HasValue && DateTime.UtcNow >= r.Published.Value);
    }

    public enum FindStatsSortBy
    {
        Relevance,
        LastPublished,
        Title
    }

    public enum FindStatsSortOrder
    {
        Asc,
        Desc
    }

    public record FindStatsPublicationViewModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Theme { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ReleaseType? ReleaseType { get; set; }

        public DateTime? LastPublished { get; set; }
        public double Score { get; set; }
    }
}
