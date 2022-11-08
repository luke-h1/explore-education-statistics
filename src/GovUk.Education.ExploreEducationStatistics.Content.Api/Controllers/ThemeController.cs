#nullable enable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net.Mime;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces.Cache;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Requests;
using GovUk.Education.ExploreEducationStatistics.Content.Services.ViewModels;
using Microsoft.AspNetCore.Mvc;
using static GovUk.Education.ExploreEducationStatistics.Common.Model.SortOrder;
using static GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces.IThemeService;
using static GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces.IThemeService.PublicationsSortBy;

namespace GovUk.Education.ExploreEducationStatistics.Content.Api.Controllers
{
    [ApiController]
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

        [HttpGet("publications")]
        public async Task<ActionResult<List<PublicationSearchResultViewModel>>> GetPublications(
            [FromQuery] PublicationsGetRequest request)
        {
            var sort = request.Sort ?? (request.Search == null ? Title : Relevance);
            var order = request.Order ?? (sort == Title ? Asc : Desc);

            return await _themeService
                .GetPublications(
                    request.ReleaseType,
                    request.ThemeId,
                    request.Search,
                    sort,
                    order,
                    offset: request.Offset,
                    limit: request.Limit)
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

        public record PublicationsGetRequest(
            ReleaseType? ReleaseType,
            Guid? ThemeId,
            [MinLength(3)] string? Search,
            PublicationsSortBy? Sort,
            SortOrder? Order,
            [Range(0, int.MaxValue)] int Offset = 0,
            [Range(1, int.MaxValue)] int Limit = 10);
    }
}
