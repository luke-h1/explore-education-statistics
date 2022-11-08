#nullable enable
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Services.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces
{
    public interface IThemeService
    {
        Task<Either<ActionResult, List<PublicationSearchResultViewModel>>> GetPublications(
            ReleaseType? releaseType,
            Guid? themeId,
            string? search,
            PublicationsSortBy sort,
            SortOrder order,
            int offset,
            int limit);

        Task<IList<ThemeTree<PublicationTreeNode>>> GetPublicationTree();

        public enum PublicationsSortBy
        {
            Published,
            Relevance,
            Title
        }
    }
}
