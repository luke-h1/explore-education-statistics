﻿#nullable enable
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Cache.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace GovUk.Education.ExploreEducationStatistics.Common.Services
{
    public class InMemoryCacheService : IInMemoryCacheService
    {
        private readonly IMemoryCache _cache;
        private readonly ILogger<InMemoryCacheService> _logger;
        private readonly List<int> HardExpiryIntervalsInSeconds; 

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

        public Task<TItem?> GetItem<TItem>(IInMemoryCacheKey cacheKey)
            where TItem : class
        {
            var cachedItem = _cache.Get<TItem>(cacheKey);

            if (cachedItem == null)
            {
                _logger.LogInformation(
                    "Cache miss for cache key {CacheKeyDescription}", 
                    GetCacheKeyDescription(cacheKey));
                return Task.FromResult((TItem?) null);
            }
            
            _logger.LogInformation(
                "Returning cached result for cache key {CacheKeyDescription}",
                GetCacheKeyDescription(cacheKey));

            return Task.FromResult(cachedItem)!;
        }

        public async Task<object?> GetItem(IInMemoryCacheKey cacheKey, Type targetType)
        {
            var cachedItem = await GetItem<object>(cacheKey);

            if (cachedItem != null && cachedItem.GetType().IsInstanceOfType(targetType))
            {
                throw new ArgumentException($"Cached type {cachedItem.GetType()} is not an instance of " +
                                            $"{nameof(targetType)} {targetType} - for cache key {cacheKey}");
            }

            return cachedItem;
        }

        public Task SetItem<TItem>(
            IInMemoryCacheKey cacheKey,
            TItem item,
            InMemoryCacheConfiguration configuration)
        {
            var expiryTimeFromNow = configuration.ExpiryTimeMillis;
            
            
            
            var options = new MemoryCacheEntryOptions
            {
                Size = configuration.SizeBytes,
                AbsoluteExpiration = configuration.ExpiryTimeMillis ? 
            };
            _cache.Set(cacheKey, item, );
            _logger.LogInformation("Setting cached item with cache key {CacheKeyDescription}", GetCacheKeyDescription(cacheKey));
            return Task.CompletedTask;
        }

        private static string GetCacheKeyDescription(IInMemoryCacheKey cacheKey)
        {
            return $"{cacheKey.GetType().Name} {cacheKey.Key}";
        }
    }
}