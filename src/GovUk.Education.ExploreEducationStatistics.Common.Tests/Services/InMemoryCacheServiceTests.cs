#nullable enable
using System;
using System.IO;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Cache.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Common.Services;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Xunit;
using static GovUk.Education.ExploreEducationStatistics.Common.BlobContainers;
using static GovUk.Education.ExploreEducationStatistics.Common.Tests.Utils.MockUtils;

namespace GovUk.Education.ExploreEducationStatistics.Common.Tests.Services
{
    public class InMemoryCacheServiceTests
    {
        private record SampleClass
        {
            public Guid Id { get; }

            public SampleClass()
            {
                Id = Guid.NewGuid();
            }
        }

        // TODO DW - add in a test for the new setting of record constructors with uppercase first letters 
        
        private record SampleCacheKey(string Key) : IInMemoryCacheKey;

        [Fact]
        public async Task SetItem()
        {
            var cacheKey = new SampleCacheKey("Key");
            const string valueToCache = "test item";

            var memoryCache = new Mock<IMemoryCache>(MockBehavior.Strict);

            var cacheConfiguration = new InMemoryCacheConfiguration(ExpirySchedule.Hourly, 45);
            var expectedCacheOptions = new MemoryCacheEntryOptions
            {
                
            };
            
            memoryCache
                .Setup(mock => mock.Set(cacheKey, valueToCache, expectedCacheOptions))
                .Returns(valueToCache);

            var service = SetupService(memoryCache.Object);
            VerifyAllMocks(memoryCache);

            await service.SetItem(cacheKey, valueToCache, cacheConfiguration);
        }

        [Fact]
        public async Task GetItem()
        {
            var entity = new SampleClass();

            var cacheKey = new SampleCacheKey("Key");

            var memoryCache = new Mock<IMemoryCache>(MockBehavior.Strict);

            SampleClass result2 = null;
            memoryCache
                .Setup(mock => mock.TryGetValue<SampleClass>(cacheKey, out result2))
                .Returns(true);

            var service = SetupService(memoryCache.Object);

            var result = await service.GetItem(cacheKey, typeof(SampleClass));
            VerifyAllMocks(memoryCache);

            Assert.Equal(entity, result);
        }

        [Fact]
        public async Task GetItem_NullIfCacheMiss()
        {
            var cacheKey = new SampleCacheKey("Key");

            var memoryCache = new Mock<IMemoryCache>(MockBehavior.Strict);

            memoryCache
                .Setup(mock => mock.Get<SampleClass>(cacheKey))
                .Returns((SampleClass) null!);

            var service = SetupService(memoryCache.Object);

            var result = await service.GetItem(cacheKey, typeof(SampleClass));
            VerifyAllMocks(memoryCache);

            Assert.Null(result);
        }

        [Fact]
        public async Task GetItem_NullIfException()
        {
            var cacheKey = new SampleCacheKey("");

            var memoryCache = new Mock<IMemoryCache>(MockBehavior.Strict);

            memoryCache
                .Setup(mock => mock.Get<SampleClass>(cacheKey))
                .Throws(new Exception("Something went wrong"));

            var service = SetupService(memoryCache.Object);

            var result = await service.GetItem(cacheKey, typeof(SampleClass));
            VerifyAllMocks(memoryCache);

            Assert.Null(result);
        }

        [Fact]
        public async Task GetItem_NullIfIncorrectType()
        {
            var entityOfIncorrectType = new SampleClass();

            var cacheKey = new SampleCacheKey("");

            var memoryCache = new Mock<IMemoryCache>(MockBehavior.Strict);

            memoryCache
                .Setup(mock => mock.Get<SampleClass>(cacheKey))
                .Returns(entityOfIncorrectType);

            var service = SetupService(memoryCache.Object);

            var result = await service.GetItem(cacheKey, typeof(string));
            VerifyAllMocks(memoryCache);

            Assert.Null(result);
        }

        private static InMemoryCacheService SetupService(
            IMemoryCache? memoryCache = null,
            ILogger<InMemoryCacheService>? logger = null)
        {
            var service = new InMemoryCacheService(
                logger ?? Mock.Of<ILogger<InMemoryCacheService>>()
            );
            service.SetMemoryCache(memoryCache ?? Mock.Of<IMemoryCache>());
            return service;
        }
    }
}
