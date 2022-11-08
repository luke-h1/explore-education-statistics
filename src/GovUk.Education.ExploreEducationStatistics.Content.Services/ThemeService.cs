#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Extensions;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Repository.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Services.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces.IThemeService;

namespace GovUk.Education.ExploreEducationStatistics.Content.Services
{
    public class ThemeService : IThemeService
    {
        private readonly ContentDbContext _contentDbContext;
        private readonly IPublicationRepository _publicationRepository;

        public ThemeService(ContentDbContext contentDbContext, IPublicationRepository publicationRepository)
        {
            _contentDbContext = contentDbContext;
            _publicationRepository = publicationRepository;
        }

        public async Task<Either<ActionResult, List<PublicationSearchResultViewModel>>> GetPublications(
            ReleaseType? releaseType,
            Guid? themeId,
            string? search,
            PublicationsSortBy sort,
            SortOrder order,
            int offset,
            int limit)
        {
            // Publications must have a published release and not be superseded
            var baseQueryable = _contentDbContext.Publications
                .Where(p => p.LatestPublishedRelease != null &&
                            (p.SupersededById == null || p.SupersededBy!.LatestPublishedReleaseId == null));

            // Filter by release type and theme
            if (releaseType.HasValue)
            {
                baseQueryable =
                    baseQueryable.Where(p => p.LatestPublishedRelease!.Type == releaseType.Value);
            }

            // Filter by free text search
            var queryable = search == null
                ? baseQueryable.Select(publication => new { Publication = publication, Rank = 0 })
                : baseQueryable.Join(_contentDbContext.PublicationsFreeTextTable(search),
                    publication => publication.Id,
                    freeTextRank => freeTextRank.Id,
                    (publication, freeTextRank) => new { Publication = publication, freeTextRank.Rank });

            var queryableWithSort = sort switch
            {
                PublicationsSortBy.Title => 
                    order == SortOrder.Asc 
                        ? queryable.OrderBy(p => p.Publication.Title) 
                        : queryable.OrderByDescending(p => p.Publication.Title),
                PublicationsSortBy.Relevance =>
                    order == SortOrder.Asc
                        ? queryable.OrderBy(p => p.Rank)
                        : queryable.OrderByDescending(p => p.Rank),
                PublicationsSortBy.Published =>
                    order == SortOrder.Asc 
                        ? queryable.OrderBy(p => p.Publication.Published) 
                        : queryable.OrderByDescending(p => p.Publication.Published),
                _ => throw new ArgumentOutOfRangeException(nameof(sort), sort, null)
            };

            // Apply sorting and offset pagination
            queryable = queryableWithSort
                .Skip(offset)
                .Take(limit);

            // Execute the query, limiting the columns which are fetched
            return await queryable
                .Select(p =>
                    new PublicationSearchResultViewModel
                    {
                        Id = p.Publication.Id,
                        Summary = p.Publication.Summary,
                        Title = p.Publication.Title,
                        Theme = p.Publication.Topic.Theme.Title,
                        Published = p.Publication.Published!.Value,
                        Type = p.Publication.LatestPublishedRelease!.Type,
                        Rank = p.Rank
                    }).ToListAsync();
        }

        public async Task<IList<ThemeTree<PublicationTreeNode>>> GetPublicationTree()
        {
            var themes = await _contentDbContext.Themes
                .Include(theme => theme.Topics)
                .ThenInclude(topic => topic.Publications)
                .ThenInclude(publication => publication.Releases)
                .ToListAsync();

            return await themes
                .ToAsyncEnumerable()
                .SelectAwait(async theme => await BuildThemeTree(theme))
                .Where(theme => theme.Topics.Any())
                .OrderBy(theme => theme.Title)
                .ToListAsync();
        }

        private async Task<ThemeTree<PublicationTreeNode>> BuildThemeTree(Theme theme)
        {
            var topics = await theme.Topics
                .ToAsyncEnumerable()
                .SelectAwait(async topic => await BuildTopicTree(topic))
                .Where(topic => topic.Publications.Any())
                .OrderBy(topic => topic.Title)
                .ToListAsync();

            return new ThemeTree<PublicationTreeNode>
            {
                Id = theme.Id,
                Title = theme.Title,
                Summary = theme.Summary,
                Topics = topics
            };
        }

        private async Task<TopicTree<PublicationTreeNode>> BuildTopicTree(Topic topic)
        {
            var publications = await topic.Publications
                .ToAsyncEnumerable()
                .Where(publication => publication
                                          .Releases
                                          .Any(r => r.IsLatestPublishedVersionOfRelease())
                                      || publication.LegacyPublicationUrl != null)
                .SelectAwait(async publication =>
                    await BuildPublicationNode(publication))
                .OrderBy(publication => publication.Title)
                .ToListAsync();

            return new TopicTree<PublicationTreeNode>
            {
                Id = topic.Id,
                Title = topic.Title,
                Publications = publications
            };
        }

        private async Task<PublicationTreeNode> BuildPublicationNode(Publication publication)
        {
            await _contentDbContext.Entry(publication)
                .Reference(p => p.LatestPublishedRelease)
                .LoadAsync();

            var latestRelease = publication.LatestPublishedRelease;
            var type = GetPublicationType(latestRelease?.Type);

            return new PublicationTreeNode
            {
                Id = publication.Id,
                Title = publication.Title,
                Slug = publication.Slug,
                Type = type,
                LegacyPublicationUrl = type == PublicationType.Legacy
                    ? publication.LegacyPublicationUrl?.ToString()
                    : null,
                IsSuperseded = await _publicationRepository.IsSuperseded(publication.Id),
                HasLiveRelease = latestRelease != null,
                LatestReleaseHasData = latestRelease != null && await HasAnyDataFiles(latestRelease.Id),
                AnyLiveReleaseHasData = await publication.Releases
                    .ToAsyncEnumerable()
                    .AnyAwaitAsync(async r => r.IsLatestPublishedVersionOfRelease()
                                              && await HasAnyDataFiles(r.Id))
            };
        }

        private async Task<bool> HasAnyDataFiles(Guid releaseId)
        {
            return await _contentDbContext.ReleaseFiles
                .Include(rf => rf.File)
                .AnyAsync(rf => rf.ReleaseId == releaseId && rf.File.Type == FileType.Data);
        }

        private static PublicationType GetPublicationType(ReleaseType? releaseType)
        {
            return releaseType switch
            {
                ReleaseType.AdHocStatistics => PublicationType.AdHoc,
                ReleaseType.NationalStatistics => PublicationType.NationalAndOfficial,
                ReleaseType.ExperimentalStatistics => PublicationType.Experimental,
                ReleaseType.ManagementInformation => PublicationType.ManagementInformation,
                ReleaseType.OfficialStatistics => PublicationType.NationalAndOfficial,
                null => PublicationType.Legacy,
                _ => throw new ArgumentOutOfRangeException()
            };
        }
    }

    // TODO EES-3707 would be nice but can't be translated
    // internal static class PublicationsQueryableExtensions
    // {
    //     public static IQueryable<PublicationWithRank> Sort(this IQueryable<PublicationWithRank> query,
    //         PublicationsSortBy sort,
    //         SortOrder order)
    //     {
    //         // For the offset pagination to work reliably a sort parameter is required
    //         // since the database doesn't apply any sorting by default so the results could be different
    //         // across different executions of the same query.
    //         // The sort parameter also needs to be unique too, e.g. can't sort by title alone if multiple publications
    //         // can have the same title, since they could swap positions across different executions.
    //         return sort switch
    //         {
    //             PublicationsSortBy.Title => 
    //                 order == SortOrder.Asc 
    //                     ? query.OrderBy(p => p.Publication.Title) 
    //                     : query.OrderByDescending(p => p.Publication.Title),
    //             PublicationsSortBy.Relevance =>
    //                 order == SortOrder.Asc
    //                     ? query.OrderBy(p => p.Rank)
    //                     : query.OrderByDescending(p => p.Rank),
    //             PublicationsSortBy.Published =>
    //                 order == SortOrder.Asc 
    //                     ? query.OrderBy(p => p.Publication.Published) 
    //                     : query.OrderByDescending(p => p.Publication.Published),
    //             _ => throw new ArgumentOutOfRangeException(nameof(sort), sort, null)
    //         };
    //     }
    // }
    //
    // internal record struct PublicationWithRank(Publication Publication, int? Rank);
}
