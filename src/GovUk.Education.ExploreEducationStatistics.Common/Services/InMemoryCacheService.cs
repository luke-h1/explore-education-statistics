#nullable enable
using System;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Cache.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace GovUk.Education.ExploreEducationStatistics.Common.Services
{
    public class InMemoryCacheService : IInMemoryCacheService
    {
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

        public Task<TItem> GetItem<TItem>(
            IInMemoryCacheKey cacheKey,
            Func<TItem> itemSupplier)
            where TItem : class
        {
            return GetItem(cacheKey, () => Task.FromResult(itemSupplier.Invoke()));
        }

        public async Task<TItem> GetItem<TItem>(
            IInMemoryCacheKey cacheKey,
            Func<Task<TItem>> itemSupplier)
            where TItem : class
        {
            var cachedItem = await GetItem<TItem>(cacheKey);

            if (cachedItem != null)
            {
                return cachedItem;
            }

            var newItem = await itemSupplier.Invoke();
            // TODO DW - add sliding window options here
            await SetItem(cacheKey, newItem);
            return newItem;
        }

        public async Task<Either<ActionResult, TItem>> GetItem<TItem>(
            IInMemoryCacheKey cacheKey,
            Func<Task<Either<ActionResult, TItem>>> itemSupplier)
            where TItem : class
        {
            // Attempt to read blob from the cache container
            var cachedEntity = await GetItem<TItem>(cacheKey);

            if (cachedEntity != null)
            {
                return cachedEntity;
            }

            // Cache miss - invoke provider instead
            return await itemSupplier().OnSuccessDo(async entity =>
            {
                // Write result to cache as a json blob before returning
                await SetItem(cacheKey, entity);
            });
        }

        public Task<TItem?> GetItem<TItem>(IInMemoryCacheKey cacheKey)
            where TItem : class
        {
            var cachedItem = _cache.Get<TItem>(cacheKey);

            _logger.LogInformation(
                cachedItem == null
                    ? "Cache miss for cache key {CacheKeyDescription}"
                    : "Returning cached result for cache key {CacheKeyDescription}",
                GetCacheKeyDescription(cacheKey));

            return Task.FromResult(cachedItem);
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
            TItem item)
        {
            _cache.Set(cacheKey, item);
            _logger.LogInformation("Setting cached item with cache key {CacheKeyDescription}", GetCacheKeyDescription(cacheKey));
            return Task.CompletedTask;
        }

        private static string GetCacheKeyDescription(IInMemoryCacheKey cacheKey)
        {
            return $"{cacheKey.GetType().Name} {cacheKey.Key}";
        }
    }
}
