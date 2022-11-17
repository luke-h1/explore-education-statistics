using System;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Admin.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Admin.ViewModels;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.ExploreEducationStatistics.Admin.Controllers.Api
{
    [Route("api")]
    [ApiController]
    [Authorize]
    public class EmbedBlocksController : ControllerBase
    {
        private readonly IEmbedBlockService _embedBlockService;

        public EmbedBlocksController(IEmbedBlockService embedBlockService)
        {
            _embedBlockService = embedBlockService;
        }

        [HttpPost("release/{releaseId}/embed-blocks")]
        public async Task<ActionResult<EmbedBlockViewModel>> CreateEmbedBlockBlock(
            Guid releaseId,
            EmbedBlockCreateRequest request)
        {
            return await _embedBlockService
                .Create(releaseId, request)
                .HandleFailuresOrOk();
        }

        // @MarkFix
        //[HttpPut("releases/{releaseId}/embed-blocks")]
        //public async Task<ActionResult<EmbedBlockViewModel>> CreateEmbedBlock(
        //    Guid releaseId,
        //    EmbedBlockUpdateRequest request)
        //{
        //    return await _embedBlockService
        //        .Update(releaseId, request)
        //        .HandleFailuresOrOk();
        //}

        // @MarkFix
        //[HttpDelete("releases/{releaseId}/embed-blocks/{embedBlockId}")]
        //public async Task<ActionResult<EmbedBlockViewModel>> CreateEmbedBlock(
        //    Guid releaseId,
        //    Guid embedBlockId)
        //{
        //    return await _embedBlockService
        //        .Delete(embedBlockId)
        //        .HandleFailuresOrOk();
        //}
    }
}
