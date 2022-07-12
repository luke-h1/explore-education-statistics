#nullable enable
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Cache.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using static GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces.ExpirySchedule;

namespace GovUk.Education.ExploreEducationStatistics.Common.Services
{
    public class InMemoryCacheService : IInMemoryCacheService
    {
        private readonly JsonSerializerSettings _jsonSerializerSettings =
            GetJsonSerializerSettings(new CamelCaseNamingStrategy());
        
        private readonly IMemoryCache _cache;
        private readonly ILogger<InMemoryCacheService> _logger;
        
        public InMemoryCacheService(
            IMemoryCache cache,
            ILogger<InMemoryCacheService> logger)
        {
            // TODO DW - set max size options here
            _cache = cache;
            _logger = logger;
        }

        public Task DeleteItem(IInMemoryCacheKey cacheKey)
        {
            _cache.Remove(cacheKey.Key);
            return Task.CompletedTask;
        }

        public Task<object?> GetItem(IInMemoryCacheKey cacheKey, Type targetType)
        {
            var cachedItem = _cache.Get<object?>(cacheKey);

            if (cachedItem == null)
            {
                _logger.LogInformation(
                    "Cache miss for cache key {CacheKeyDescription}", 
                    GetCacheKeyDescription(cacheKey));
                return Task.FromResult((object?) null);
            }
            
            _logger.LogInformation(
                "Returning cached result for cache key {CacheKeyDescription}",
                GetCacheKeyDescription(cacheKey));

            if (cachedItem != null && cachedItem.GetType().IsInstanceOfType(targetType))
            {
                throw new ArgumentException($"Cached type {cachedItem.GetType()} is not an instance of " +
                                            $"{nameof(targetType)} {targetType} - for cache key {cacheKey}");
            }

            return Task.FromResult(cachedItem);
        }

        public Task SetItem<TItem>(
            IInMemoryCacheKey cacheKey,
            TItem item,
            InMemoryCacheConfiguration configuration)
        {
            DateTime? absoluteExpiryTime = null;

            if (configuration.CacheDurationInSeconds != null && configuration.ExpirySchedule != None)
            {
                var midnightToday = DateTime.Today.ToUniversalTime();
                var now = DateTime.UtcNow;
                var targetAbsoluteExpiryDateTime = now.AddSeconds(configuration.CacheDurationInSeconds.Value);

                var expiryWindowStartTimesToday = configuration.GetDailyExpiryStartTimesInSeconds()
                    .Select(milliseconds => midnightToday.AddSeconds(milliseconds))
                    .ToList();

                var midnightTomorrow = DateTime.Today.ToUniversalTime().AddDays(1);
                var nextExpiryWindowStart = expiryWindowStartTimesToday
                    .FirstOrDefault(expiryWindowStart => expiryWindowStart > now, midnightTomorrow);

                absoluteExpiryTime = targetAbsoluteExpiryDateTime < nextExpiryWindowStart 
                    ? targetAbsoluteExpiryDateTime 
                    : nextExpiryWindowStart.AddMilliseconds(-1);
            }
            
            // Calculate an approximate size in bytes for this object. As there is no built-in mechanism
            // for determining the memory size of a C# object, this is a rough approximation.
            var json = JsonConvert.SerializeObject(item, null, _jsonSerializerSettings);
            var approximateSizeInBytes = Encoding.GetEncoding("utf-8").GetByteCount(json);

            var expiryTime = absoluteExpiryTime != null 
                ? new DateTimeOffset(absoluteExpiryTime.Value)
                : (DateTimeOffset?) null;
            
            _cache.Set(cacheKey, item, new MemoryCacheEntryOptions
            {
                Size = approximateSizeInBytes,
                AbsoluteExpiration = expiryTime 
            });
            
            _logger.LogInformation("Setting cached item with cache key {CacheKeyDescription}, " +
                                   "approx size {Size} bytes, expiry time {ExpiryTime}", 
                GetCacheKeyDescription(cacheKey), approximateSizeInBytes, expiryTime);
            return Task.CompletedTask;
        }

        private static string GetCacheKeyDescription(IInMemoryCacheKey cacheKey)
        {
            return $"{cacheKey.GetType().Name} {cacheKey.Key}";
        }

        private static JsonSerializerSettings GetJsonSerializerSettings(NamingStrategy namingStrategy)
        {
            return new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = namingStrategy,
                },
                NullValueHandling = NullValueHandling.Ignore,
                TypeNameHandling = TypeNameHandling.Auto
            };
        }
    }
}
