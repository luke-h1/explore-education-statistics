#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GovUk.Education.ExploreEducationStatistics.Admin.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Admin.Services.Interfaces.Cache;
using GovUk.Education.ExploreEducationStatistics.Admin.Services.Interfaces.Security;
using GovUk.Education.ExploreEducationStatistics.Admin.ViewModels;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Chart;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces.Security;
using GovUk.Education.ExploreEducationStatistics.Common.Utils;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Repository.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Release = GovUk.Education.ExploreEducationStatistics.Content.Model.Release;
using Unit = GovUk.Education.ExploreEducationStatistics.Common.Model.Unit;

namespace GovUk.Education.ExploreEducationStatistics.Admin.Services
{
    public class EmbedBlockService : IEmbedBlockService
    {
        private readonly ContentDbContext _contentDbContext;
        private readonly IPersistenceHelper<ContentDbContext> _persistenceHelper;
        private readonly IUserService _userService;

        public EmbedBlockService(
            ContentDbContext contentDbContext,
            IPersistenceHelper<ContentDbContext> persistenceHelper,
            IUserService userService)
        {
            _contentDbContext = contentDbContext;
            _persistenceHelper = persistenceHelper;
            _userService = userService;
        }

        public async Task<Either<ActionResult, EmbedBlockViewModel>> Create(Guid releaseId,
            EmbedBlockCreateRequest request)
        {
            return await _persistenceHelper
                .CheckEntityExists<Release>(releaseId)
                .OnSuccess(_userService.CheckCanUpdateRelease)
                .OnSuccess(async _ =>
                {
                    var embedBlock = new EmbedBlock
                    {
                        Id = Guid.NewGuid(),
                        Title = request.Title,
                        Url = request.Url,
                    };

                    var contentSection = await _contentDbContext.ContentSections
                        .Include(cs => cs.Content)
                        .SingleAsync(cs => cs.Id == request.ContentSectionId);

                    var order = contentSection.Content.Any() // @MarkFix abstract into common methoddy
                        ? contentSection.Content.Max(contentBlock => contentBlock.Order) + 1
                        : 1;

                    var contentBlock = new EmbedBlockLink
                    {
                        ContentSectionId = request.ContentSectionId,
                        Order = order,
                        EmbedBlockId = embedBlock.Id,
                    };

                    // NOTE: No need to create a ReleaseContentBlock here - see EES-1568

                    _contentDbContext.EmbedBlocks.Add(embedBlock);
                    _contentDbContext.ContentBlocks.Add(contentBlock);

                    await _contentDbContext.SaveChangesAsync();

                    return new EmbedBlockViewModel();
                });
        }

        // @MarkFix
        //public async Task<Either<ActionResult, EmbedBlockViewModel>> Update(Guid releaseId,
        //    EmbedBlockUpdateRequest request)
        //{
        //    return await _persistenceHelper
        //        .CheckEntityExists<Release>(releaseId)
        //        .OnSuccess(_userService.CheckCanUpdateRelease)
        //        .OnSuccess(async release =>
        //        {
        //            // @MarkFix
        //        });
        //}

        // @MarkFix
        //public async Task<Either<ActionResult, Unit>> Delete(Guid releaseId, Guid embedBlockId)
        //{
        //    return await _persistenceHelper
        //        .CheckEntityExists<Release>(releaseId)
        //        .OnSuccessDo(_userService.CheckCanUpdateRelease)
        //        .OnSuccessVoid(r => DeleteEmbedBlock(embedBlockId));
        //}

    }
}
