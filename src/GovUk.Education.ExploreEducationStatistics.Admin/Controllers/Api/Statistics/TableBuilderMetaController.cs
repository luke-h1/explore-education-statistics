#nullable enable
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data.Query;
using GovUk.Education.ExploreEducationStatistics.Data.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Services.ViewModels.Meta;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.ExploreEducationStatistics.Admin.Controllers.Api.Statistics
{
    [ApiController]
    [Authorize]
    public class TableBuilderMetaController : ControllerBase
    {
        private readonly ISubjectMetaService _subjectMetaService;

        public TableBuilderMetaController(ISubjectMetaService subjectMetaService)
        {
            _subjectMetaService = subjectMetaService;
        }

        [HttpGet("api/data/release/{releaseId:guid}/meta/subject/{subjectId:guid}")]
        public Task<ActionResult<SubjectMetaViewModel>> GetSubjectMeta(Guid releaseId, Guid subjectId)
        {
            return _subjectMetaService.GetSubjectMetaRestricted(releaseId, subjectId)
                .HandleFailuresOrOk();
        }

        [HttpPost("api/data/release/{releaseId:guid}/meta/subject")]
        public Task<ActionResult<SubjectMetaViewModel>> GetSubjectMeta(
            Guid releaseId,
            [FromBody] ObservationQueryContext query,
            CancellationToken cancellationToken)
        {
            return _subjectMetaService.GetSubjectMetaRestricted(releaseId, query, cancellationToken)
                .HandleFailuresOrOk();
        }

        [HttpPatch("api/data/release/{releaseId:guid}/meta/subject/{subjectId:guid}/filters")]
        public Task<ActionResult<Unit>> UpdateFilters(
            Guid releaseId,
            Guid subjectId,
            List<FilterUpdateViewModel> request)
        {
            return _subjectMetaService.UpdateSubjectFilters(releaseId, subjectId, request)
                .HandleFailuresOrOk();
        }

        [HttpPatch("api/data/release/{releaseId:guid}/meta/subject/{subjectId:guid}/indicators")]
        public Task<ActionResult<Unit>> UpdateIndicators(
            Guid releaseId,
            Guid subjectId,
            List<IndicatorGroupUpdateViewModel> request)
        {
            return _subjectMetaService.UpdateSubjectIndicators(releaseId, subjectId, request)
                .HandleFailuresOrOk();
        }
    }
}
