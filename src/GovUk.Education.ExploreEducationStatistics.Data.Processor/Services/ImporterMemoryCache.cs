#nullable enable
using System;
using Microsoft.Extensions.Caching.Memory;

namespace GovUk.Education.ExploreEducationStatistics.Data.Processor.Services
{
    public class ImporterMemoryCache
    {
        public MemoryCache Cache { get; set; } = new(new MemoryCacheOptions
        {
            SizeLimit = 200000,
            ExpirationScanFrequency = TimeSpan.FromMinutes(30)
        });
    }
}
