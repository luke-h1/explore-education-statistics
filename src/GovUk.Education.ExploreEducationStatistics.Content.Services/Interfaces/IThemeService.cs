#nullable enable
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
        Task<Either<ActionResult, List<FindStatsPublicationViewModel>>> GetPublications(
            ReleaseType? releaseType,
            string? searchTerm,
            int page,
            int pageSize,
            FindStatsSortBy sortBy,
            FindStatsSortOrder sortOrder);

        Task<IList<ThemeTree<PublicationTreeNode>>> GetPublicationTree();
    }
}
