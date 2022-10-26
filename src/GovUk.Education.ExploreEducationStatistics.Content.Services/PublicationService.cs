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
using Lifti;
using Lifti.Serialization.Binary;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using static GovUk.Education.ExploreEducationStatistics.Common.BlobContainers;

namespace GovUk.Education.ExploreEducationStatistics.Content.Services;

public class PublicationService : IPublicationService
{
    private readonly ContentDbContext _contentDbContext;
    private readonly IBlobStorageService _blobStorageService;
    private readonly IPersistenceHelper<ContentDbContext> _contentPersistenceHelper;

    public PublicationService(
        ContentDbContext contentDbContext,
        IBlobStorageService blobStorageService,
        IPersistenceHelper<ContentDbContext> contentPersistenceHelper)
    {
        _contentDbContext = contentDbContext;
        _blobStorageService = blobStorageService;
        _contentPersistenceHelper = contentPersistenceHelper;
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
        await UpdatePublicationIndex();

        var serializer = new BinarySerializer<Guid>();
        using var stream = new MemoryStream();
        await _blobStorageService.DownloadToStream(PublicContent, "publications.index", stream);

        // Deserialize the index into a new instance
        var index = BuildPublicationsFullTextIndex();
        await serializer.DeserializeAsync(index, stream, disposeStream: false);

        // This isn't too clever because if there's no search term we're just using the text index to filter by release type
        // and if there's no release type we're 
        var query = $"(Title={searchTerm ?? "*"} | Summary={searchTerm ?? "*"})";
        if (releaseType.HasValue)
        {
            query += $" & ReleaseType={releaseType.ToString()}";
        }

        var results = index.Search(query).ToList();
        var resultIds = results.Select(r => r.Key);
        var scores = results.ToDictionary(r => r.Key, r => r.Score);

        // LIFTI only returns id's/scores so fetch the publications and relevant release details from the database
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

        // TODO not sure how sorting or pagination would work for this yet
        return dbResults
            .OrderBy(p => p.Score)
            .ToList();
    }

    public async Task UpdatePublicationIndex()
    {
        var publications = await _contentDbContext.Publications
            .Include(p => p.Releases)
            .Where(p => p.LegacyPublicationUrl != null ||
                        p.Releases.Any(r =>
                            r.Published.HasValue && DateTime.UtcNow >= r.Published.Value
                                                 && !r.Publication.Releases.Any(r2 =>
                                                     r2.Published.HasValue && DateTime.UtcNow >= r2.Published.Value
                                                                           && r.Id == r2.PreviousVersionId
                                                                           && r.Id != r2.Id)))
            .Select(p => new FindStatsIndexNode
            {
                Id = p.Id,
                Summary = p.Summary,
                Title = p.Title,
                ReleaseType = ReleaseType.NationalStatistics // TODO
            })
            .ToListAsync();

        var index = BuildPublicationsFullTextIndex();
        await index.AddRangeAsync(publications);

        // Serialize the index
        var serializer = new BinarySerializer<Guid>();
        using var stream = new MemoryStream();
        await serializer.SerializeAsync(index, stream, disposeStream: false);

        // Upload the index to blob storage
        await _blobStorageService.UploadStream(PublicContent, "publications.index", stream,
            MediaTypeNames.Application.Octet);
    }

    private static Either<ActionResult, Release> GetLatestRelease(Publication publication)
    {
        return publication.LatestPublishedRelease() ?? new Either<ActionResult, Release>(new NotFoundResult());
    }

    private async Task<PublicationCacheViewModel> BuildPublicationViewModel(Publication publication,
        Release latestRelease)
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

    private static FullTextIndex<Guid> BuildPublicationsFullTextIndex()
    {
        return new FullTextIndexBuilder<Guid>()
            .WithObjectTokenization<FindStatsIndexNode>(
                itemOptions => itemOptions
                    .WithKey(item => item.Id)
                    .WithField("Title", p => p.Title,
                        tokenOptions => tokenOptions.WithStemming())
                    .WithField("Summary", p => p.Summary,
                        tokenOptions => tokenOptions.WithStemming())
                    .WithField("ReleaseType", p => p.ReleaseType?.ToString() ?? string.Empty)
            )
            .Build();
    }

    public record FindStatsIndexNode
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public ReleaseType? ReleaseType { get; set; }
    }

    public enum FindStatsSortBy
    {
        Relevance,
        DateLastPublished,
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
