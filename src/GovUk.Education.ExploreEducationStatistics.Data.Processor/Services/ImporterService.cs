#nullable enable
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Data.Model;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Data.Processor.Exceptions;
using GovUk.Education.ExploreEducationStatistics.Data.Processor.Models;
using GovUk.Education.ExploreEducationStatistics.Data.Processor.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Processor.Utils;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GovUk.Education.ExploreEducationStatistics.Data.Processor.Services
{
    public class ImporterService : IImporterService
    {
        private readonly IGuidGenerator _guidGenerator;
        private readonly ImporterLocationService _importerLocationService;
        private readonly ImporterFilterService _importerFilterService;
        private readonly IImporterMetaService _importerMetaService;
        private readonly IDataImportService _dataImportService;
        private readonly ILogger<ImporterService> _logger;
        private readonly ITransactionHelper _transactionHelper;

        private const int Stage2RowCheck = 1000;

        private static readonly Dictionary<GeographicLevel, string[]> ColumnValues =
            new()
            {
                {
                    GeographicLevel.Country,
                    new[] {"country_code", "country_name"}
                },
                {
                    GeographicLevel.EnglishDevolvedArea,
                    new[] {"english_devolved_area_code", "english_devolved_area_name"}
                },
                {
                    GeographicLevel.Institution,
                    new[] {"institution_id", "institution_name"}
                },
                {
                    GeographicLevel.LocalAuthority,
                    new[] {"new_la_code", "old_la_code", "la_name"}
                },
                {
                    GeographicLevel.LocalAuthorityDistrict,
                    new[] {"lad_code", "lad_name"}
                },
                {
                    GeographicLevel.LocalEnterprisePartnership,
                    new[] {"local_enterprise_partnership_code", "local_enterprise_partnership_name"}
                },
                {
                    GeographicLevel.MayoralCombinedAuthority,
                    new[] {"mayoral_combined_authority_code", "mayoral_combined_authority_name"}
                },
                {
                    GeographicLevel.MultiAcademyTrust,
                    new[] {"trust_id", "trust_name"}
                },
                {
                    GeographicLevel.OpportunityArea,
                    new[] {"opportunity_area_code", "opportunity_area_name"}
                },
                {
                    GeographicLevel.ParliamentaryConstituency,
                    new[] {"pcon_code", "pcon_name"}
                },
                {
                    GeographicLevel.Provider,
                    new[] {"provider_ukprn", "provider_name"}
                },
                {
                    GeographicLevel.Region,
                    new[] {"region_code", "region_name"}
                },
                {
                    GeographicLevel.School,
                    new[] {"school_urn", "school_name"}
                },
                {
                    GeographicLevel.Sponsor,
                    new[] {"sponsor_id", "sponsor_name"}
                },
                {
                    GeographicLevel.Ward,
                    new[] {"ward_code", "ward_name"}
                },
                {
                    GeographicLevel.PlanningArea,
                    new[] {"planning_area_code", "planning_area_name"}
                }
            };

        public ImporterService(
            IGuidGenerator guidGenerator,
            ImporterFilterService importerFilterService,
            ImporterLocationService importerLocationService,
            IImporterMetaService importerMetaService,
            IDataImportService dataImportService, 
            ILogger<ImporterService> logger, 
            ITransactionHelper transactionHelper)
        {
            _guidGenerator = guidGenerator;
            _importerFilterService = importerFilterService;
            _importerLocationService = importerLocationService;
            _importerMetaService = importerMetaService;
            _dataImportService = dataImportService;
            _logger = logger;
            _transactionHelper = transactionHelper;
        }

        public Task<SubjectMeta> ImportMeta(
            List<string> metaFileCsvHeaders,
            List<List<string>> metaFileRows, 
            Subject subject,
            StatisticsDbContext context)
        {
            return _importerMetaService.Import(metaFileCsvHeaders, metaFileRows, subject, context);
        }

        public SubjectMeta GetMeta(
            List<string> metaFileCsvHeaders,
            List<List<string>> metaFileRows, 
            Subject subject,
            StatisticsDbContext context)
        {
            return _importerMetaService.Get(metaFileCsvHeaders, metaFileRows, subject, context);
        }

        record FilterItemMeta(string FilterLabel, string FilterGroupLabel, string FilterItemLabel);
        
        [SuppressMessage("ReSharper", "NotAccessedPositionalProperty.Local")]
        record FilterGroupMeta(string FilterLabel, string FilterGroupLabel);

        public async Task ImportFiltersAndLocations(
            DataImport dataImport,
            Func<Task<Stream>> dataFileStreamProvider,
            SubjectMeta subjectMeta,
            StatisticsDbContext context)
        {
            var colValues = await CsvUtil.GetCsvHeaders(dataFileStreamProvider);
            var totalRows = await CsvUtil.GetTotalRows(dataFileStreamProvider);
            var soleGeographicLevel = dataImport.HasSoleGeographicLevel();

            var filterItems = new HashSet<FilterItemMeta>();
            var filterGroups = new Dictionary<FilterGroupMeta, FilterGroup>();
            var locations = new HashSet<Location>();
            
            await CsvUtil.ForEachRow(dataFileStreamProvider, async (cells, index) =>
            {
                if (index % Stage2RowCheck == 0)
                {
                    var currentStatus = await _dataImportService.GetImportStatus(dataImport.Id);

                    if (currentStatus.IsFinishedOrAborting())
                    {
                        _logger.LogInformation(
                            "Import for {FileName} has finished or is being aborted, " +
                            "so finishing importing Filters and Locations early", dataImport.File.Filename);
                        return false;
                    }

                    await _dataImportService.UpdateStatus(dataImport.Id,
                        DataImportStatus.STAGE_2,
                        (double) (index + 1) / totalRows * 100);
                }

                if (CsvUtil.IsRowAllowed(soleGeographicLevel, cells, colValues))
                {
                    foreach (var filterMeta in subjectMeta.Filters)
                    {
                        var filterItemLabel = CsvUtil.Value(cells, colValues, filterMeta.Column);

                        if (filterItemLabel.IsNullOrWhitespace())
                        {
                            filterItemLabel = "Not specified";
                        }
                        
                        var filterGroupLabel = CsvUtil.Value(cells, colValues, filterMeta.FilterGroupingColumn);

                        if (filterGroupLabel.IsNullOrWhitespace())
                        {
                            filterGroupLabel = "Default";
                        }

                        var filterGroupMeta = new FilterGroupMeta(filterMeta.Filter.Label, filterGroupLabel);
                        
                        if (!filterGroups.ContainsKey(filterGroupMeta))
                        {
                            filterGroups.Add(filterGroupMeta, new FilterGroup(filterMeta.Filter, filterGroupLabel));
                        }

                        filterItems.Add(new FilterItemMeta(filterMeta.Filter.Label, filterGroupLabel, filterItemLabel));
                    }

                    locations.Add(
                        ReadLocationFromCsv(
                            CsvUtil.GetGeographicLevel(cells, colValues),
                            GetCountry(cells, colValues),
                            GetEnglishDevolvedArea(cells, colValues),
                            GetInstitution(cells, colValues),
                            GetLocalAuthority(cells, colValues),
                            GetLocalAuthorityDistrict(cells, colValues),
                            GetLocalEnterprisePartnership(cells, colValues),
                            GetMayoralCombinedAuthority(cells, colValues),
                            GetMultiAcademyTrust(cells, colValues),
                            GetOpportunityArea(cells, colValues),
                            GetParliamentaryConstituency(cells, colValues),
                            GetPlanningArea(cells, colValues),
                            GetProvider(cells, colValues),
                            GetRegion(cells, colValues),
                            GetRscRegion(cells, colValues),
                            GetSchool(cells, colValues),
                            GetSponsor(cells, colValues),
                            GetWard(cells, colValues)
                        ));
                }

                return true;
            });

            var filterItemEntities = filterItems
                .Select(filterItem =>
                    new FilterItem(
                        filterItem.FilterItemLabel, 
                        filterGroups[new FilterGroupMeta(filterItem.FilterLabel, filterItem.FilterGroupLabel)]))
                    .ToList();

            var newLocations = locations.Where(
                location => _importerLocationService.Find(context, location) == null)
                .ToList();
            
            await _transactionHelper.DoInTransaction(context, async () =>
            {
                await context.FilterGroup.AddRangeAsync(filterGroups.Values);
                await context.FilterItem.AddRangeAsync(filterItemEntities);
                await context.SaveChangesAsync();
            });
            
            await _importerLocationService.CreateAndCache(context, newLocations);
        }

        public async Task ImportObservations(DataImport import,
            Func<Task<Stream>> dataFileStreamProvider,
            Subject subject,
            SubjectMeta subjectMeta,
            int batchNo,
            StatisticsDbContext context)
        {
            var observations = (await GetObservations(
                import,
                context,
                dataFileStreamProvider,
                subject,
                subjectMeta,
                batchNo)).ToList();

            await InsertObservations(context, observations);
        }

        public TimeIdentifier GetTimeIdentifier(IReadOnlyList<string> cells, List<string> colValues)
        {
            var timeIdentifier = CsvUtil.Value(cells, colValues, "time_identifier").ToLower();
            foreach (var value in Enum.GetValues(typeof(TimeIdentifier)).Cast<TimeIdentifier>())
            {
                if (value.GetEnumLabel().Equals(timeIdentifier, StringComparison.InvariantCultureIgnoreCase))
                {
                    return value;
                }
            }

            throw new InvalidTimeIdentifierException(timeIdentifier);
        }

        public int GetYear(IReadOnlyList<string> cells, List<string> colValues)
        {
            var tp = CsvUtil.Value(cells, colValues, "time_period");
            if (tp == null)
            {
                throw new InvalidTimePeriodException(null);
            }

            return int.Parse(tp.Substring(0, 4));
        }

        private async Task<IEnumerable<Observation>> GetObservations(
            DataImport import,
            StatisticsDbContext context,
            Func<Task<Stream>> dataFileStreamProvider,
            Subject subject,
            SubjectMeta subjectMeta,
            int batchNo)
        {
            var soleGeographicLevel = import.HasSoleGeographicLevel();
            var csvHeaders = await CsvUtil.GetCsvHeaders(dataFileStreamProvider);

            return (await CsvUtil.Select(dataFileStreamProvider, (cells, index) =>
            {
                if (CsvUtil.IsRowAllowed(soleGeographicLevel, cells, csvHeaders))
                {
                    return ObservationFromCsv(
                        context,
                        cells,
                        csvHeaders,
                        subject,
                        subjectMeta,
                        (batchNo - 1) * import.RowsPerBatch + index + 2);
                }

                return null;
            }))
                .Where(observation => observation != null)
                .Cast<Observation>();
        }

        private Observation ObservationFromCsv(
            StatisticsDbContext context,
            List<string> cells,
            List<string> colValues,
            Subject subject,
            SubjectMeta subjectMeta,
            int csvRowNum)
        {
            var observationId = _guidGenerator.NewGuid();

            return new Observation
            {
                Id = observationId,
                FilterItems = GetFilterItems(context, cells, colValues, subjectMeta.Filters, observationId),
                LocationId = GetLocationId(context, cells, colValues),
                Measures = GetMeasures(cells, colValues, subjectMeta.Indicators),
                SubjectId = subject.Id,
                TimeIdentifier = GetTimeIdentifier(cells, colValues),
                Year = GetYear(cells, colValues),
                CsvRow = csvRowNum
            };
        }

        private ICollection<ObservationFilterItem> GetFilterItems(
            StatisticsDbContext context,
            IReadOnlyList<string> cells,
            List<string> colValues,
            IEnumerable<(Filter Filter, string Column, string FilterGroupingColumn)> filtersMeta,
            Guid observationId)
        {
            return filtersMeta.Select(filterMeta =>
            {
                var filterItemLabel = CsvUtil.Value(cells, colValues, filterMeta.Column);
                var filterGroupLabel = CsvUtil.Value(cells, colValues, filterMeta.FilterGroupingColumn);

                return new ObservationFilterItem
                {
                    ObservationId = observationId,
                    FilterItemId = _importerFilterService
                        .Find(filterItemLabel, filterGroupLabel, filterMeta.Filter, context).Id,
                    FilterId = filterMeta.Filter.Id
                };
            }).ToList();
        }

        private Guid GetLocationId(StatisticsDbContext context, IReadOnlyList<string> cells, List<string> colValues)
        {
            var location = ReadLocationFromCsv(
                CsvUtil.GetGeographicLevel(cells, colValues),
                GetCountry(cells, colValues),
                GetEnglishDevolvedArea(cells, colValues),
                GetInstitution(cells, colValues),
                GetLocalAuthority(cells, colValues),
                GetLocalAuthorityDistrict(cells, colValues),
                GetLocalEnterprisePartnership(cells, colValues),
                GetMayoralCombinedAuthority(cells, colValues),
                GetMultiAcademyTrust(cells, colValues),
                GetOpportunityArea(cells, colValues),
                GetParliamentaryConstituency(cells, colValues),
                GetPlanningArea(cells, colValues),
                GetProvider(cells, colValues),
                GetRegion(cells, colValues),
                GetRscRegion(cells, colValues),
                GetSchool(cells, colValues),
                GetSponsor(cells, colValues),
                GetWard(cells, colValues));
                
            return _importerLocationService.Find(context, location)!.Id;
        }

        private static Dictionary<Guid, string> GetMeasures(IReadOnlyList<string> cells,
            List<string> colValues,
            IEnumerable<(Indicator Indicator, string Column)> indicators)
        {
            var valueTuples = indicators.ToList();
            var columns = valueTuples.Select(tuple => tuple.Column);
            var values = CsvUtil.Values(cells, colValues, columns);

            return valueTuples.Zip(values, (tuple, value) => new {tuple, value})
                .ToDictionary(item => item.tuple.Indicator.Id, item => item.value);
        }

        private static Country GetCountry(IReadOnlyList<string> cells, List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.Country], values =>
                new Country(values[0], values[1]));
        }

        private static EnglishDevolvedArea GetEnglishDevolvedArea(IReadOnlyList<string> cells, List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.EnglishDevolvedArea], values =>
                new EnglishDevolvedArea(values[0], values[1]));
        }

        private static Institution GetInstitution(IReadOnlyList<string> cells,
            List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.Institution], values =>
                new Institution(values[0], values[1]));
        }

        private static LocalAuthority GetLocalAuthority(IReadOnlyList<string> cells, List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.LocalAuthority], values =>
                new LocalAuthority(values[0], values[1], values[2]));
        }

        private static LocalAuthorityDistrict GetLocalAuthorityDistrict(IReadOnlyList<string> cells,
            List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.LocalAuthorityDistrict], values =>
                new LocalAuthorityDistrict(values[0], values[1]));
        }

        private static LocalEnterprisePartnership GetLocalEnterprisePartnership(IReadOnlyList<string> cells,
            List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.LocalEnterprisePartnership], values =>
                new LocalEnterprisePartnership(values[0], values[1]));
        }

        private static MayoralCombinedAuthority GetMayoralCombinedAuthority(IReadOnlyList<string> cells,
            List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.MayoralCombinedAuthority], values =>
                new MayoralCombinedAuthority(values[0], values[1]));
        }

        private static Mat GetMultiAcademyTrust(IReadOnlyList<string> cells, List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.MultiAcademyTrust], values =>
                new Mat(values[0], values[1]));
        }

        private static OpportunityArea GetOpportunityArea(IReadOnlyList<string> cells, List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.OpportunityArea], values =>
                new OpportunityArea(values[0], values[1]));
        }

        private static ParliamentaryConstituency GetParliamentaryConstituency(IReadOnlyList<string> cells,
            List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.ParliamentaryConstituency], values =>
                new ParliamentaryConstituency(values[0], values[1]));
        }

        private static Provider GetProvider(IReadOnlyList<string> cells,
            List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.Provider], values =>
                new Provider(values[0], values[1]));
        }

        private static Region GetRegion(IReadOnlyList<string> cells, List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.Region], values =>
                new Region(values[0], values[1]));
        }

        private static RscRegion GetRscRegion(IReadOnlyList<string> cells, List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, "rsc_region_lead_name", value => new RscRegion(value));
        }

        private static School GetSchool(IReadOnlyList<string> cells, List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.School], values =>
                new School(values[0], values[1]));
        }

        private static Sponsor GetSponsor(IReadOnlyList<string> cells, List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.Sponsor], values =>
                new Sponsor(values[0], values[1]));
        }

        private static Ward GetWard(IReadOnlyList<string> cells, List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.Ward], values =>
                new Ward(values[0], values[1]));
        }

        private static PlanningArea GetPlanningArea(IReadOnlyList<string> cells, List<string> colValues)
        {
            return CsvUtil.BuildType(cells, colValues, ColumnValues[GeographicLevel.PlanningArea], values =>
                new PlanningArea(values[0], values[1]));
        }
        
        private Location ReadLocationFromCsv(
            GeographicLevel geographicLevel,
            Country country,
            EnglishDevolvedArea? englishDevolvedArea = null,
            Institution? institution = null,
            LocalAuthority? localAuthority = null,
            LocalAuthorityDistrict? localAuthorityDistrict = null,
            LocalEnterprisePartnership? localEnterprisePartnership = null,
            MayoralCombinedAuthority? mayoralCombinedAuthority = null,
            Mat? multiAcademyTrust = null,
            OpportunityArea? opportunityArea = null,
            ParliamentaryConstituency? parliamentaryConstituency = null,
            PlanningArea? planningArea = null,
            Provider? provider = null,
            Region? region = null,
            RscRegion? rscRegion = null,
            School? school = null,
            Sponsor? sponsor = null,
            Ward? ward = null)
        {
            return new Location
            {
                GeographicLevel = geographicLevel,
                Country = country,
                EnglishDevolvedArea = englishDevolvedArea,
                Institution = institution,
                LocalAuthority = localAuthority,
                LocalAuthorityDistrict = localAuthorityDistrict,
                LocalEnterprisePartnership = localEnterprisePartnership,
                MayoralCombinedAuthority = mayoralCombinedAuthority,
                MultiAcademyTrust = multiAcademyTrust,
                OpportunityArea = opportunityArea,
                ParliamentaryConstituency = parliamentaryConstituency,
                PlanningArea = planningArea,
                Provider = provider,
                Region = region,
                RscRegion = rscRegion,
                School = school,
                Sponsor = sponsor,
                Ward = ward
            };
        }

        private static async Task InsertObservations(DbContext context, IEnumerable<Observation> observations)
        {
            var observationsTable = new DataTable();
            observationsTable.Columns.Add("Id", typeof(Guid));
            observationsTable.Columns.Add("SubjectId", typeof(Guid));
            observationsTable.Columns.Add("LocationId", typeof(Guid));
            observationsTable.Columns.Add("Year", typeof(int));
            observationsTable.Columns.Add("TimeIdentifier", typeof(string));
            observationsTable.Columns.Add("Measures", typeof(string));
            observationsTable.Columns.Add("CsvRow", typeof(long));

            var observationsFilterItemsTable = new DataTable();
            observationsFilterItemsTable.Columns.Add("ObservationId", typeof(Guid));
            observationsFilterItemsTable.Columns.Add("FilterItemId", typeof(Guid));
            observationsFilterItemsTable.Columns.Add("FilterId", typeof(Guid));

            foreach (var o in observations)
            {
                observationsTable.Rows.Add(
                    o.Id,
                    o.SubjectId,
                    o.LocationId,
                    o.Year,
                    o.TimeIdentifier.GetEnumValue(),
                    "{" + string.Join(",", o.Measures.Select(x => $"\"{x.Key}\":\"{x.Value}\"")) + "}",
                    o.CsvRow
                );

                foreach (var item in o.FilterItems)
                {
                    observationsFilterItemsTable.Rows.Add(
                        item.ObservationId,
                        item.FilterItemId,
                        item.FilterId
                    );
                }
            }

            var parameter = new SqlParameter("@Observations", SqlDbType.Structured)
            {
                Value = observationsTable, TypeName = "[dbo].[ObservationType]"
            };

            await context.Database.ExecuteSqlRawAsync("EXEC [dbo].[InsertObservations] @Observations", parameter);

            parameter = new SqlParameter("@ObservationFilterItems", SqlDbType.Structured)
            {
                Value = observationsFilterItemsTable, TypeName = "[dbo].[ObservationFilterItemType]"
            };

            await context.Database.ExecuteSqlRawAsync(
                "EXEC [dbo].[InsertObservationFilterItems] @ObservationFilterItems", parameter);
        }
    }
}
