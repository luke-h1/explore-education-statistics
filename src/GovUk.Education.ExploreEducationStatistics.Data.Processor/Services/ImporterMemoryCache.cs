#nullable enable
using System;
using Microsoft.Extensions.Caching.Memory;

namespace GovUk.Education.ExploreEducationStatistics.Data.Processor.Services;

public class ImporterMemoryCache
{
    private MemoryCache Cache { get; set; } = new(new MemoryCacheOptions
    {
        SizeLimit = 50000,
        ExpirationScanFrequency = TimeSpan.FromMinutes(10)
    });
    
    private MemoryCacheEntryOptions CacheEntryOptions = new()
    {
        Size = 1,
        SlidingExpiration = TimeSpan.FromMinutes(1)
    };

    public TItem Set<TItem>(object cacheKey, TItem cacheItem)
    {
        return Cache.Set(cacheKey, cacheItem, CacheEntryOptions);
    }
    
    public TItem GetOrCreate<TItem>(object cacheKey, Func<TItem> defaultItemProvider)
    {
        return Cache.GetOrCreate(cacheKey, entry =>
        {
            var defaultItem = defaultItemProvider.Invoke();
            entry.SetOptions(CacheEntryOptions);
            entry.Value = defaultItem;
            return defaultItem;
        });
    }
}