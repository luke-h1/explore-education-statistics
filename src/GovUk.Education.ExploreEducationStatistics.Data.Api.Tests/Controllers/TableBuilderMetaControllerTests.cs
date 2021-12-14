#nullable enable
using System;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Common.Tests.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Tests.Fixtures;
using GovUk.Education.ExploreEducationStatistics.Data.Api.Controllers;
using GovUk.Education.ExploreEducationStatistics.Data.Api.Services.Cache;
using GovUk.Education.ExploreEducationStatistics.Data.Api.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Query;
using GovUk.Education.ExploreEducationStatistics.Data.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Services.ViewModels.Meta;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using static GovUk.Education.ExploreEducationStatistics.Common.Tests.Utils.MockUtils;
using static Moq.MockBehavior;

namespace GovUk.Education.ExploreEducationStatistics.Data.Api.Tests.Controllers
{
    [Collection(BlobCacheServiceTests)]
    public class TableBuilderMetaControllerTests : BlobCacheServiceTestFixture
    {
        private static readonly Guid SubjectId = Guid.NewGuid();

        private static readonly SubjectMetaQueryContext QueryContext = new()
        {
            SubjectId = SubjectId
        };

        [Fact]
        public async Task GetSubjectMeta()
        {
            var subjectMetaViewModel = new SubjectMetaViewModel();

            var cacheKey = new SubjectMetaCacheKey("publication", "release", SubjectId);

            var (controller, mocks) = BuildControllerAndMocks();

            mocks
                .cacheKeyService
                .Setup(s => s.CreateCacheKeyForSubjectMeta(SubjectId))
                .ReturnsAsync(cacheKey);
            
            mocks.cacheService
                .Setup(s => s.GetItem(cacheKey, typeof(SubjectMetaViewModel)))
                .ReturnsAsync(null);

            mocks
                .subjectMetaService
                .Setup(s => s.GetSubjectMeta(SubjectId))
                .ReturnsAsync(subjectMetaViewModel);

            mocks.cacheService
                .Setup(s => s.SetItem<object>(cacheKey, subjectMetaViewModel))
                .Returns(Task.CompletedTask);

            var result = await controller.GetSubjectMeta(SubjectId);
            VerifyAllMocks(mocks);

            result.AssertOkResult(subjectMetaViewModel);
        }

        [Fact]
        public async Task GetSubjectMeta_NotFound()
        {
            var (controller, mocks) = BuildControllerAndMocks();

            var cacheKey = new SubjectMetaCacheKey("publication", "release", SubjectId);
            
            mocks
                .cacheKeyService
                .Setup(s => s.CreateCacheKeyForSubjectMeta(SubjectId))
                .ReturnsAsync(cacheKey);
            
            mocks.cacheService
                .Setup(s => s.GetItem(cacheKey, typeof(SubjectMetaViewModel)))
                .ReturnsAsync(null);
            
            mocks
                .subjectMetaService
                .Setup(s => s.GetSubjectMeta(SubjectId))
                .ReturnsAsync(new NotFoundResult());

            var result = await controller.GetSubjectMeta(SubjectId);
            VerifyAllMocks(mocks);

            result.AssertNotFoundResult();
        }

        [Fact]
        public async Task Post_GetSubjectMeta()
        {
            var subjectMetaViewModel = new SubjectMetaViewModel();

            var (controller, mocks) = BuildControllerAndMocks();

            mocks
                .subjectMetaService
                .Setup(s => s.GetSubjectMeta(QueryContext))
                .ReturnsAsync(subjectMetaViewModel);

            var result = await controller.GetSubjectMeta(QueryContext);
            VerifyAllMocks(mocks);

            result.AssertOkResult(subjectMetaViewModel);
        }

        [Fact]
        public async Task Post_GetSubjectMeta_NotFound()
        {
            var (controller, mocks) = BuildControllerAndMocks();

            mocks
                .subjectMetaService
                .Setup(s => s.GetSubjectMeta(QueryContext))
                .ReturnsAsync(new NotFoundResult());

            var result = await controller.GetSubjectMeta(QueryContext);
            VerifyAllMocks(mocks);

            result.AssertNotFoundResult();
        }

        private static (
            TableBuilderMetaController controller,
            (
                Mock<ISubjectMetaService> subjectMetaService, 
                Mock<ICacheKeyService> cacheKeyService,
                Mock<IBlobCacheService> cacheService) mocks)
            BuildControllerAndMocks()
        {
            var subjectMetaService = new Mock<ISubjectMetaService>(Strict);
            var cacheKeyService = new Mock<ICacheKeyService>(Strict);
            var controller = new TableBuilderMetaController(subjectMetaService.Object, cacheKeyService.Object);
            
            return (controller, (subjectMetaService, cacheKeyService, CacheService));
        }
    }
}
