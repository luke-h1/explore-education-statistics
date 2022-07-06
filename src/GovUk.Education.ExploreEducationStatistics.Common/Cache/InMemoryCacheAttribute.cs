#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Cache.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;

namespace GovUk.Education.ExploreEducationStatistics.Common.Cache
{
    public class InMemoryCacheAttribute : CacheAttribute
    {
        private static Dictionary<string, IInMemoryCacheService> Services { get; set; } = new();

        protected override Type BaseKey => typeof(IInMemoryCacheKey);

        /// <summary>
        /// Specify a service to use <see cref="Services"/>.
        /// Otherwise, we use the first registered service.
        /// </summary>
        public string? ServiceName { get; set; }

        public InMemoryCacheAttribute(Type key) : base(key)
        {
        }

        public static void AddService(string name, IInMemoryCacheService service)
        {
            Services[name] = service;
        }
        public static void RemoveService(string name)
        {
            Services.Remove(name);
        }

        public static void ClearServices()
        {
            Services.Clear();
        }

        public override async Task<object?> Get(ICacheKey cacheKey, Type returnType)
        {
            if (cacheKey is IInMemoryCacheKey key)
            {
                var service = GetService();

                if (service is null)
                {
                    return null;
                }

                return await service.GetItem(key, returnType);
            }

            throw new ArgumentException($"Cache key must by assignable to {BaseKey.GetPrettyFullName()}");
        }

        // TODO DW - lots of duplication here with BlobCacheAttribute 
        public override async Task Set(ICacheKey cacheKey, object value)
        {
            if (cacheKey is IInMemoryCacheKey key)
            {
                var service = GetService();

                if (service is null)
                {
                    return;
                }

                await service.SetItem(key, value);

                return;
            }

            throw new ArgumentException($"Cache key must by assignable to {BaseKey.GetPrettyFullName()}");
        }

        private IInMemoryCacheService? GetService()
        {
            if (ServiceName is not null)
            {
                return Services[ServiceName];
            }

            return Services.Count > 0 ? Services.First().Value : null;
        }
    }
}