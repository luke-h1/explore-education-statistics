#nullable enable
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Services;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces.Cache;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Requests;
using GovUk.Education.ExploreEducationStatistics.Content.Services.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.ExploreEducationStatistics.Content.Api.Controllers
{
    [Route("api")]
    [Produces(MediaTypeNames.Application.Json)]
    public class ThemeController : ControllerBase
    {
        private readonly IMethodologyCacheService _methodologyCacheService;
        private readonly IThemeCacheService _themeCacheService;
        private readonly IThemeService _themeService;

        public ThemeController(IMethodologyCacheService methodologyCacheService,
            IThemeCacheService themeCacheService,
            IThemeService themeService)
        {
            _methodologyCacheService = methodologyCacheService;
            _themeCacheService = themeCacheService;
            _themeService = themeService;
        }

        [HttpGet("find-stats-prototype")]
        public async Task<ActionResult<List<FindStatsPublicationViewModel>>> GetPublications(
            [FromQuery(Name = "page")] int page,
            [FromQuery(Name = "pageSize")] int pageSize = 10,
            [FromQuery(Name = "searchTerm")] string? searchTerm = null,
            [FromQuery(Name = "releaseType")] ReleaseType? releaseType = null,
            [FromQuery(Name = "sortBy")] FindStatsSortBy sortBy = FindStatsSortBy.Title,
            [FromQuery(Name = "sortOrder")] FindStatsSortOrder sortOrder = FindStatsSortOrder.Asc)
        {
            // TODO Use Min validation for page and pageSize

            return await _themeService
                .GetPublications(
                    releaseType,
                    searchTerm,
                    page: page,
                    pageSize: pageSize,
                    sortBy,
                    sortOrder)
                .HandleFailuresOrOk();
        }

        [HttpGet("themes")]
        public async Task<ActionResult<IList<ThemeTree<PublicationTreeNode>>>> GetPublicationTree(
            [FromQuery(Name = "publicationFilter")] PublicationTreeFilter? filter = null)
        {
            if (filter == null)
            {
                return new BadRequestResult();
            }
            
            return await _themeCacheService
                .GetPublicationTree(filter.Value)
                .HandleFailuresOrOk();
        }

        [HttpGet("methodology-themes")]
        public async Task<ActionResult<List<AllMethodologiesThemeViewModel>>> GetMethodologyThemes()
        {
            return await _methodologyCacheService
                .GetSummariesTree()
                .HandleFailuresOrOk();
        }
    }
}
