#nullable enable
using System;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Cache.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;

public interface IInMemoryCacheService
{
    Task<object?> GetItem(IInMemoryCacheKey cacheKey, Type targetType);

    Task SetItem<TItem>(IInMemoryCacheKey cacheKey, TItem item, InMemoryCacheConfiguration configuration);

    // TODO DW - remove?
    Task DeleteItem(IInMemoryCacheKey cacheKey);
}

public record InMemoryCacheConfiguration(int SizeBytes, int? ExpiryTimeMillis);