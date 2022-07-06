#nullable enable
using System;
using System.IO;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Cache.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

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

        public Task<TItem> GetItem<TItem>(
            IInMemoryCacheKey cacheKey,
            Func<Task<TItem>> itemSupplier)
            where TItem : class
        {
            return _cache.GetOrCreateAsync(cacheKey, cacheEntry =>
            {
                // TODO DW - add sliding window options here
                return itemSupplier.Invoke();
            });
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
            return Task.FromResult<TItem?>(_cache.Get<TItem>(cacheKey));
        }

        public async Task<object?> GetItem(IInMemoryCacheKey cacheKey, Type targetType)
        {
            var cachedItem = await GetItem<object>(cacheKey, () => null!);
            
            if (cachedItem != null )
            return cachedItem;
        }

        public Task SetItem<TItem>(
            IInMemoryCacheKey cacheKey,
            TItem item)
        {
            _cache.Set(cacheKey, item);
            return Task.CompletedTask;
        }
    }
}
