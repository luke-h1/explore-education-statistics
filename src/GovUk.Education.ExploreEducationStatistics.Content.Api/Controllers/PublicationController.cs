#nullable enable
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Services;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Services.Interfaces.Cache;
using GovUk.Education.ExploreEducationStatistics.Content.Services.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.ExploreEducationStatistics.Content.Api.Controllers
{
    [Route("api")]
    [Produces(MediaTypeNames.Application.Json)]
    public class PublicationController : ControllerBase
    {
        private readonly IPublicationCacheService _publicationCacheService;
        private readonly IPublicationService _publicationService;

        public PublicationController(IPublicationCacheService publicationCacheService,
            IPublicationService publicationService)
        {
            _publicationCacheService = publicationCacheService;
            _publicationService = publicationService;
        }

        [HttpGet("find-stats-prototype")]
        public async Task<ActionResult<List<PublicationService.FindStatsPublicationViewModel>>> GetPublications(
            [FromQuery(Name = "page")] int page,
            [FromQuery(Name = "pageSize")] int pageSize = 10,
            [FromQuery(Name = "searchTerm")] string? searchTerm = null,
            [FromQuery(Name = "releaseType")] ReleaseType? releaseType = null,
            [FromQuery(Name = "sortBy")] PublicationService.FindStatsSortBy sortBy =
                PublicationService.FindStatsSortBy.Title,
            [FromQuery(Name = "sortOrder")] PublicationService.FindStatsSortOrder sortOrder =
                PublicationService.FindStatsSortOrder.Asc)
        {
            // TODO Use Min validation for page and pageSize

            return await _publicationService
                .GetPublications(
                    releaseType,
                    searchTerm,
                    page: page,
                    pageSize: pageSize,
                    sortBy,
                    sortOrder)
                .HandleFailuresOrOk();
        }

        [HttpGet("publications/{slug}/title")]
        public async Task<ActionResult<PublicationTitleViewModel>> GetPublicationTitle(string slug)
        {
            return await _publicationCacheService.GetPublication(slug)
                .OnSuccess(p => new PublicationTitleViewModel
                {
                    Id = p.Id,
                    Title = p.Title,
                })
                .HandleFailuresOrOk();
        }
    }
}
