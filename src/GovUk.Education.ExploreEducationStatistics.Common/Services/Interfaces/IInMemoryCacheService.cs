#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Cache.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using Microsoft.AspNetCore.Mvc;
using static System.Linq.Enumerable;

namespace GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;

public interface IInMemoryCacheService
{
    Task<object?> GetItem(IInMemoryCacheKey cacheKey, Type targetType);

    Task SetItem<TItem>(IInMemoryCacheKey cacheKey, TItem item, InMemoryCacheConfiguration configuration);

    // TODO DW - remove?
    Task DeleteItem(IInMemoryCacheKey cacheKey);
}

public enum ExpiryPeriod
{
    Hourly,
    HalfHourly,
    Never
}

public record InMemoryCacheConfiguration(int SizeBytes, int? DurationToCacheInMillis, ExpiryPeriod? ExpiryPeriods)
{
    public List<int> GetDailyExpiryStartTimesInMillis()
    {
        switch (ExpiryPeriods)
        {
            case ExpiryPeriod.HalfHourly: 
                return Range(0, 48)
                    .Select(i => i * 30 * 1000)
                    .ToList();   
            case ExpiryPeriod.Hourly:
                return Range(0, 24)
                    .Select(i => i * 60 * 1000)
                    .ToList();
            case ExpiryPeriod.Never:
                return new List<int>();
            default:
                throw new ArgumentException($"Unhandled {nameof(ExpiryPeriods)} value {ExpiryPeriods}");
        }
    }
        

}