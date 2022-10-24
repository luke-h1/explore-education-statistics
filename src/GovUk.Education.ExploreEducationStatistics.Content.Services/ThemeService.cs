#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Extensions;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Services.ViewModels;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace GovUk.Education.ExploreEducationStatistics.Content.Services
{
    public class ThemeService : IThemeService
    {
        private readonly ContentDbContext _contentDbContext;

        public ThemeService(ContentDbContext contentDbContext)
        {
            _contentDbContext = contentDbContext;
        }

        public async Task<Either<ActionResult, List<FindStatsPublicationViewModel>>> GetPublications(
            ReleaseType? releaseType,
            string? searchTerm,
            int page,
            int pageSize,
            FindStatsSortBy sortBy,
            FindStatsSortOrder sortOrder)
        {
            // TODO this predicate needs adapting to allow for legacy publications with no release type
            // TODO it's also expecting a releaseType param to always exist which isn't correct
            Expression<Func<Publication, bool>> searchPredicate = publication => publication.Releases
                .Where(r =>
                    // Filter releases to those which are the published versions
                    r.Published.HasValue && DateTime.UtcNow >= r.Published.Value
                                                 && !publication.Releases.Any(r2 =>
                                                     r2.Published.HasValue && DateTime.UtcNow >= r2.Published.Value
                                                                           && r2.PreviousVersionId == r.Id
                                                                           && r2.Id != r.Id)
                                                 )
                .OrderBy(r => Convert.ToInt16(r.ReleaseName))
                .ThenBy(r => r.TimePeriodCoverage)
                // Latest release by year and time period must match release type
                .LastOrDefault().Type == releaseType;

            // Append a full-text predicate if a search term exists
            if (!string.IsNullOrEmpty(searchTerm))
            {
                Expression<Func<Publication, bool>> fullTextPredicate = PredicateBuilder.False<Publication>();
                fullTextPredicate = fullTextPredicate.Or(p => EF.Functions.Contains(p.Summary, searchTerm));
                fullTextPredicate = fullTextPredicate.Or(p => EF.Functions.Contains(p.Title, searchTerm));
                searchPredicate = searchPredicate.And(fullTextPredicate);
            }

            // Create the queryable using the search predicate
            var matchingPublications = _contentDbContext.Publications
                .Include(p => p.Topic)
                .ThenInclude(p => p.Theme)
                .Include(p => p.Releases)
                .Where(searchPredicate);

            // Filter out superseded publications, i.e. publications that have a supersededById which relates to a
            // publication that has a published release. Do this by correlating them in a LEFT JOIN with all the
            // publications that have any published release, using the SupersededById of the publication as the join key.
            //
            // Publications which are not superseded are those where the RIGHT hand side of this join are null. I.e.
            //  - the publication is not superseded so SupersededById is null
            //  - the publication is superseded but there's no matching publication which has a published release

            var publicationsWithAnyPublishedRelease = _contentDbContext.Publications
                .Include(p => p.Releases)
                .Where(p => p.Releases.Any(r => r.Published.HasValue && DateTime.UtcNow >= r.Published.Value));

            var matchingPublicationsNotSuperseded = (from matching in matchingPublications
                    join any in publicationsWithAnyPublishedRelease
                        on matching.SupersededById equals any.Id into grouping
                    from any in grouping.DefaultIfEmpty()
                    select new { any, matching }).Where(x => x.any == null)
                .Select(x => x.matching);

            // Apply sorting
            // For the offset pagination to work reliably a sort parameter is required
            // since the database doesn't apply any sorting by default so the results could be different
            // across different executions of the same query.
            // The sort parameter also needs to be unique too, e.g. can't sort by title alone if multiple publications
            // can have the same title, since they could swap positions across different execution.

            // TODO will also need to cater for sorting by relevance or by date last published
            Expression<Func<Publication,string>> orderByExpression = p => p.Title;
            var withSort = sortOrder == FindStatsSortOrder.Asc ?
                matchingPublicationsNotSuperseded.OrderBy(orderByExpression) :
                matchingPublicationsNotSuperseded.OrderByDescending(orderByExpression);

            // Apply offset pagination to the query
            var position = page < 0 ? 0 : (page-1) * pageSize;
            var withOffset = withSort.Skip(position).Take(pageSize);

            // Execute the query
            // Transform each publication into the view model limiting the columns which are selected
            return await withOffset
                .Select(p =>
                new FindStatsPublicationViewModel
                {
                    Id = p.Id,
                    Title = p.Title,
                    Summary = p.Summary,
                    Theme = p.Topic.Theme.Title,
                    LastPublished =
                        p.Releases.Count == 0 ? null :
                        p.Releases
                        .Where(r =>
                            // Filter releases to those which are the published versions
                            r.Published.HasValue && DateTime.UtcNow >= r.Published.Value
                                                 && !p.Releases.Any(r2 =>
                                                     r2.Published.HasValue && DateTime.UtcNow >= r2.Published.Value
                                                                           && r2.PreviousVersionId == r.Id
                                                                           && r2.Id != r.Id)
                        )
                        .OrderBy(r => Convert.ToInt16(r.ReleaseName))
                        .ThenBy(r => r.TimePeriodCoverage)
                        // Latest release by year and time period must match release type
                        .Last().Published,
                    ReleaseType =
                        p.Releases.Count == 0 ? null :
                        p.Releases
                        .Where(r =>
                            // Filter releases to those which are the published versions
                            r.Published.HasValue && DateTime.UtcNow >= r.Published.Value
                                                 && !p.Releases.Any(r2 =>
                                                     r2.Published.HasValue && DateTime.UtcNow >= r2.Published.Value
                                                                           && r2.PreviousVersionId == r.Id
                                                                           && r2.Id != r.Id)
                        )
                        .OrderBy(r => Convert.ToInt16(r.ReleaseName))
                        .ThenBy(r => r.TimePeriodCoverage)
                        // Latest release by year and time period must match release type
                        .Last().Type
                }
            ).ToListAsync();
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
            var latestRelease = publication.LatestPublishedRelease();
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
                IsSuperseded = IsSuperseded(publication),
                HasLiveRelease = latestRelease != null,
                LatestReleaseHasData = latestRelease != null && await HasAnyDataFiles(latestRelease),
                AnyLiveReleaseHasData = await publication.Releases
                    .ToAsyncEnumerable()
                    .AnyAwaitAsync(async r => r.IsLatestPublishedVersionOfRelease()
                                              && await HasAnyDataFiles(r))
            };
        }

        private bool IsSuperseded(Publication publication)
        {
            return publication.SupersededById != null
                   && _contentDbContext.Releases
                       .Include(r => r.Publication)
                       .Any(r => r.PublicationId == publication.SupersededById
                                 && r.Published.HasValue && DateTime.UtcNow >= r.Published.Value);
        }

        private async Task<bool> HasAnyDataFiles(Release release)
        {
            return await _contentDbContext.ReleaseFiles
                .Include(rf => rf.File)
                .AnyAsync(rf => rf.ReleaseId == release.Id && rf.File.Type == FileType.Data);
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
    }
}
