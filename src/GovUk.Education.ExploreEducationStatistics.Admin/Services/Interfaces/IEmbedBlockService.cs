#nullable enable
using System;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Admin.ViewModels;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.ExploreEducationStatistics.Admin.Services.Interfaces
{
    public interface IEmbedBlockService
    {
        Task<Either<ActionResult, EmbedBlockViewModel>> Create(Guid releaseId, EmbedBlockCreateRequest request);

        Task<Either<ActionResult, EmbedBlockViewModel>> Update(Guid releaseId, EmbedBlockUpdateRequest request);

        Task<Either<ActionResult, Unit>> Delete(Guid releaseId, Guid embedBlockId);
    }
}
