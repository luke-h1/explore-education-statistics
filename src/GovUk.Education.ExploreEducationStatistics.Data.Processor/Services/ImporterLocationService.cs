#nullable enable
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Model;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Database;
using Microsoft.EntityFrameworkCore;
using static GovUk.Education.ExploreEducationStatistics.Common.Services.CollectionUtils;
using static GovUk.Education.ExploreEducationStatistics.Data.Processor.Services.ImporterMemoryCache;

namespace GovUk.Education.ExploreEducationStatistics.Data.Processor.Services
{
    public class ImporterLocationService
    {
        private readonly ImporterMemoryCache _memoryCache;
        private readonly IGuidGenerator _guidGenerator;
        
        public ImporterLocationService(
            ImporterMemoryCache memoryCache, 
            IGuidGenerator guidGenerator)
        {
            _memoryCache = memoryCache;
            _guidGenerator = guidGenerator;
        }
        
        public Location? Find(StatisticsDbContext context, Location location)
        {
            return _memoryCache.GetOrCreate(
                GetCacheKey(location), 
                () => Lookup(context, location));
        }

        private static Location? Lookup(StatisticsDbContext context, Location locationToLookup)
        {
            var predicateBuilder = PredicateBuilder.True<Location>()
                .And(location => location.GeographicLevel == locationToLookup.GeographicLevel);

            predicateBuilder = predicateBuilder
                .And(location => location.Country_Code == locationToLookup.Country_Code
                                 && location.Country_Name == locationToLookup.Country_Name);

            predicateBuilder = predicateBuilder
                .And(location =>
                    location.EnglishDevolvedArea_Code == locationToLookup.EnglishDevolvedArea_Code
                    && location.EnglishDevolvedArea_Name == locationToLookup.EnglishDevolvedArea_Name);

            predicateBuilder = predicateBuilder
                .And(location => location.Institution_Code == locationToLookup.Institution_Code
                                 && location.Institution_Name == locationToLookup.Institution_Name);

            // Also match the old LA code even if blank
            predicateBuilder = predicateBuilder
                .And(location =>
                    location.LocalAuthority_Code == locationToLookup.LocalAuthority_Code
                    && location.LocalAuthority_OldCode == locationToLookup.LocalAuthority_OldCode
                    && location.LocalAuthority_Name == locationToLookup.LocalAuthority_Name);

            predicateBuilder = predicateBuilder
                .And(location =>
                    location.LocalAuthorityDistrict_Code == locationToLookup.LocalAuthorityDistrict_Code
                    && location.LocalAuthorityDistrict_Name == locationToLookup.LocalAuthorityDistrict_Name);

            predicateBuilder = predicateBuilder
                .And(location =>
                    location.LocalEnterprisePartnership_Code == locationToLookup.LocalEnterprisePartnership_Code
                    && location.LocalEnterprisePartnership_Name == locationToLookup.LocalEnterprisePartnership_Name);

            predicateBuilder = predicateBuilder
                .And(location =>
                    location.MayoralCombinedAuthority_Code == locationToLookup.MayoralCombinedAuthority_Code
                    && location.MayoralCombinedAuthority_Name == locationToLookup.MayoralCombinedAuthority_Name);

            predicateBuilder = predicateBuilder
                .And(location => location.MultiAcademyTrust_Code == locationToLookup.MultiAcademyTrust_Code
                                 && location.MultiAcademyTrust_Name == locationToLookup.MultiAcademyTrust_Name);

            predicateBuilder = predicateBuilder
                .And(location => location.OpportunityArea_Code == locationToLookup.OpportunityArea_Code
                                 && location.OpportunityArea_Name == locationToLookup.OpportunityArea_Name);

            predicateBuilder = predicateBuilder
                .And(location =>
                    location.ParliamentaryConstituency_Code == locationToLookup.ParliamentaryConstituency_Code
                    && location.ParliamentaryConstituency_Name == locationToLookup.ParliamentaryConstituency_Name);

            predicateBuilder = predicateBuilder
                .And(location => location.PlanningArea_Code == locationToLookup.PlanningArea_Code
                                 && location.PlanningArea_Name == locationToLookup.PlanningArea_Name);

            predicateBuilder = predicateBuilder
                .And(location => location.Provider_Code == locationToLookup.Provider_Code
                                 && location.Provider_Name == locationToLookup.Provider_Name);

            predicateBuilder = predicateBuilder
                .And(location => location.Region_Code == locationToLookup.Region_Code
                                 && location.Region_Name == locationToLookup.Region_Name);

            // Note that Name is not included in the predicate here as it is the same as the code
            predicateBuilder = predicateBuilder
                .And(location => location.RscRegion_Code == locationToLookup.RscRegion_Code);

            predicateBuilder = predicateBuilder
                .And(location =>
                    location.School_Code == locationToLookup.School_Code
                    && location.School_Name == locationToLookup.School_Name);

            predicateBuilder = predicateBuilder
                .And(location => location.Sponsor_Code == locationToLookup.Sponsor_Code
                                 && location.Sponsor_Name == locationToLookup.Sponsor_Name);

            predicateBuilder = predicateBuilder
                .And(location => location.Ward_Code == locationToLookup.Ward_Code
                                 && location.Ward_Name == locationToLookup.Ward_Name);

            // This can return multiple results because C# equality is translated directly to SQL equality
            // and our config of SqlServer is using the default case-insensitive collation
            // See https://docs.microsoft.com/en-us/ef/core/miscellaneous/collations-and-case-sensitivity
            var locations = context
                .Location
                .AsNoTracking()
                .Where(predicateBuilder)
                .ToList();

            // Perform case-sensitive comparison on the Name fields
            return locations.FirstOrDefault(location =>
                location.Country_Name == locationToLookup.Country_Name
                && location.EnglishDevolvedArea_Name == locationToLookup.EnglishDevolvedArea?.Name
                && location.Institution_Name == locationToLookup.Institution?.Name
                && location.LocalAuthority_Name == locationToLookup.LocalAuthority?.Name
                && location.LocalAuthorityDistrict_Name == locationToLookup.LocalAuthorityDistrict?.Name
                && location.LocalEnterprisePartnership_Name == locationToLookup.LocalEnterprisePartnership?.Name
                && location.MayoralCombinedAuthority_Name == locationToLookup.MayoralCombinedAuthority?.Name
                && location.MultiAcademyTrust_Name == locationToLookup.MultiAcademyTrust?.Name
                && location.OpportunityArea_Name == locationToLookup.OpportunityArea?.Name
                && location.ParliamentaryConstituency_Name == locationToLookup.ParliamentaryConstituency?.Name
                && location.PlanningArea_Name == locationToLookup.PlanningArea?.Name
                && location.Provider_Name == locationToLookup.Provider?.Name
                && location.Region_Name == locationToLookup.Region?.Name
                && location.RscRegion_Code == locationToLookup.RscRegion?.Code // RscRegion codes function as the name
                && location.School_Name == locationToLookup.School?.Name
                && location.Sponsor_Name == locationToLookup.Sponsor?.Name
                && location.Ward_Name == locationToLookup.Ward?.Name
            );
        }

        public async Task<List<Location>> CreateAndCache(StatisticsDbContext context, List<Location> locations)
        {
            await locations.
                ToAsyncEnumerable()
                .ForEachAwaitAsync(async location =>
            {
                var existingLocation = Lookup(context, location);

                if (existingLocation == null)
                {
                    // Save and cache the new Location as soon as possible, as Locations are shareable between ongoing
                    // imports.  Therefore it is best to store it in the database as soon as possible so as to avoid 
                    // interfering with parallel imports of other Subjects using the same Locations.
                    location.Id = _guidGenerator.NewGuid();
                    await context.AddRangeAsync(locations);
                    await context.SaveChangesAsync();
                    _memoryCache.Set(GetCacheKey(location), location);
                }
            });
            
            return locations;
        }

        public async Task<Location> CreateAndCache(StatisticsDbContext context, Location location)
        {
            return (await CreateAndCache(context, ListOf(location)))[0];
        }
    }
}
