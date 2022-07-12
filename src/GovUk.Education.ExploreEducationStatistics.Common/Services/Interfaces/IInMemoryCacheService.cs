#nullable enable
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Cache.Interfaces;
using static System.Linq.Enumerable;

namespace GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;

public interface IInMemoryCacheService
{
    Task<object?> GetItem(IInMemoryCacheKey cacheKey, Type targetType);

    Task SetItem<TItem>(IInMemoryCacheKey cacheKey, TItem item, InMemoryCacheConfiguration configuration);

    // TODO DW - remove?
    Task DeleteItem(IInMemoryCacheKey cacheKey);
}

public enum ExpirySchedule
{
    Hourly,
    HalfHourly,
    None
}

public record InMemoryCacheConfiguration(ExpirySchedule ExpirySchedule, int? CacheDurationInSeconds)
{
    public List<int> GetDailyExpiryStartTimesInSeconds()
    {
        return ExpirySchedule switch
        {
            ExpirySchedule.None => new List<int>(),
            ExpirySchedule.HalfHourly => Range(0, 48).Select(i => i * 30 * 60).ToList(),
            ExpirySchedule.Hourly => Range(0, 24).Select(i => i * 60 * 60).ToList(),
            _ => throw new ArgumentException($"Unhandled {nameof(ExpirySchedule)} value {ExpirySchedule}")
        };
    }
        

}