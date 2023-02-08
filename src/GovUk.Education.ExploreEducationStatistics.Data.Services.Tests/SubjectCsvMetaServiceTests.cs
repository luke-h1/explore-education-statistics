#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data.Query;
using GovUk.Education.ExploreEducationStatistics.Common.Tests.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Tests.Fixtures;
using GovUk.Education.ExploreEducationStatistics.Content.Model;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Model;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Repository;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Tests.Fixtures;
using GovUk.Education.ExploreEducationStatistics.Data.Services.ViewModels.Meta;
using Moq;
using Xunit;
using static GovUk.Education.ExploreEducationStatistics.Common.Model.TimeIdentifier;
using static GovUk.Education.ExploreEducationStatistics.Common.Services.CollectionUtils;
using static GovUk.Education.ExploreEducationStatistics.Common.Tests.Utils.MockUtils;
using static GovUk.Education.ExploreEducationStatistics.Content.Model.Tests.Utils.ContentDbUtils;
using static GovUk.Education.ExploreEducationStatistics.Data.Model.Tests.Utils.StatisticsDbUtils;
using static Moq.MockBehavior;
using Release = GovUk.Education.ExploreEducationStatistics.Data.Model.Release;

namespace GovUk.Education.ExploreEducationStatistics.Data.Services.Tests;

public class SubjectCsvMetaServiceTests
{
    [Fact]
    public async Task GetCsvSubjectMeta()
    {
        var fixture = new DataFixture();

        var releaseSubject = new ReleaseSubject
        {
            Release = fixture.DefaultRelease(),
            Subject = fixture.DefaultSubject(),
        };

        var releaseFile = new ReleaseFile
        {
            Release = new Content.Model.Release
            {
                Id = releaseSubject.Release.Id,
            },
            File = new File
            {
                SubjectId = releaseSubject.Subject.Id
            }
        };

        var filterItems = fixture.DefaultFilterItem().GenerateArray(4);
        var filters = fixture.DefaultFilter()
            .WithSubject(releaseSubject.Subject)
            .WithFilterGroups(
                ..1,
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems[..2])
                    .Generate(1))
            .WithFilterGroups(
                1..2,
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems[2..])
                    .Generate(1))
            .GenerateList(2);

        var indicators = fixture.DefaultIndicator()
            .WithIndicatorGroup(
                ..1,
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject))
            .WithIndicatorGroup(
                1..3,
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject))
            .GenerateList(3);

        var locations = fixture.DefaultLocation()
            .ForRange(..2, l => l.SetPresetRegion())
            .ForRange(2..4, l => l.SetPresetRegionAndLocalAuthority())
            .GenerateList(4);

        var observations = fixture.DefaultObservation()
            .WithSubject(releaseSubject.Subject)
            .WithMeasures(indicators)
            .ForRange(..2, o => o
                .SetFilterItems(filterItems[0], filterItems[2])
                .SetLocation(locations[0])
                .SetTimePeriod(2022, AcademicYear))
            .ForRange(2..4, o => o
                .SetFilterItems(filterItems[0], filterItems[2])
                .SetLocation(locations[1])
                .SetTimePeriod(2022, AcademicYear))
            .ForRange(4..6, o => o
                .SetFilterItems(filterItems[1], filterItems[3])
                .SetLocation(locations[2])
                .SetTimePeriod(2023, AcademicYear))
            .ForRange(6..8, o => o
                .SetFilterItems(filterItems[1], filterItems[3])
                .SetLocation(locations[3])
                .SetTimePeriod(2023, AcademicYear))
            .GenerateList(8);

        var contextId = Guid.NewGuid().ToString();

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            await contentDbContext.ReleaseFiles.AddRangeAsync(releaseFile);
            await contentDbContext.SaveChangesAsync();

            await statisticsDbContext.ReleaseSubject.AddRangeAsync(releaseSubject);
            await statisticsDbContext.Filter.AddRangeAsync(filters);
            await statisticsDbContext.Indicator.AddRangeAsync(indicators);
            await statisticsDbContext.Location.AddRangeAsync(locations);
            await statisticsDbContext.Observation.AddRangeAsync(observations);
            await statisticsDbContext.SaveChangesAsync();
        }

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            var releaseFileBlobService = new Mock<IReleaseFileBlobService>(Strict);

            // Stubbing this out as testing headers in other methods
            releaseFileBlobService
                .Setup(s =>
                    s.StreamBlob(It.IsAny<ReleaseFile>(), null, default))
                .ReturnsAsync("csv_header".ToStream());

            var service = BuildService(
                statisticsDbContext: statisticsDbContext,
                contentDbContext: contentDbContext,
                releaseFileBlobService: releaseFileBlobService.Object);

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.SubjectId,
                Indicators = indicators.Select(i => i.Id).ToList()
            };

            var result =
                await service.GetSubjectCsvMeta(releaseSubject, query, observations);

            VerifyAllMocks(releaseFileBlobService);

            var viewModel = result.AssertRight();

            Assert.Equal(2, viewModel.Filters.Count);

            var viewModelFilter0 = viewModel.Filters[filters[0].Name];
            var viewModelFilter1 = viewModel.Filters[filters[1].Name];

            Assert.Equal(filters[0].Id, viewModelFilter0.Id);
            Assert.Equal(filters[0].Name, viewModelFilter0.Name);
            Assert.Equal(filters[1].Id, viewModelFilter1.Id);
            Assert.Equal(filters[1].Name, viewModelFilter1.Name);

            var viewModelFilter0Items = viewModelFilter0.Items;
            Assert.Equal(2, viewModelFilter0Items.Count);

            var viewModelFilter0Item0 = viewModelFilter0Items[filterItems[0].Id];
            var viewModelFilter0Item1 = viewModelFilter0Items[filterItems[1].Id];

            Assert.Equal(filterItems[0].Id, viewModelFilter0Item0.Id);
            Assert.Equal(filterItems[0].Label, viewModelFilter0Item0.Label);
            Assert.Equal(filterItems[1].Id, viewModelFilter0Item1.Id);
            Assert.Equal(filterItems[1].Label, viewModelFilter0Item1.Label);

            var viewModelFilter1Items = viewModel.Filters[filters[1].Name].Items;
            Assert.Equal(2, viewModelFilter1Items.Count);

            var viewModelFilter1Item0 = viewModelFilter1Items[filterItems[2].Id];
            var viewModelFilter1Item1 = viewModelFilter1Items[filterItems[3].Id];

            Assert.Equal(filterItems[2].Id, viewModelFilter1Item0.Id);
            Assert.Equal(filterItems[2].Label, viewModelFilter1Item0.Label);
            Assert.Equal(filterItems[3].Id, viewModelFilter1Item1.Id);
            Assert.Equal(filterItems[3].Label, viewModelFilter1Item1.Label);

            Assert.Equal(3, viewModel.Indicators.Count);
            AssertIndicatorCsvViewModel(indicators[0], viewModel.Indicators[indicators[0].Name]);
            AssertIndicatorCsvViewModel(indicators[1], viewModel.Indicators[indicators[1].Name]);
            AssertIndicatorCsvViewModel(indicators[2], viewModel.Indicators[indicators[2].Name]);

            var viewModelLocations = viewModel.Locations;

            Assert.Equal(4, viewModelLocations.Count);
            Assert.Equal(locations[0].GetCsvValues(),viewModelLocations[locations[0].Id]);
            Assert.Equal(locations[1].GetCsvValues(),viewModelLocations[locations[1].Id]);
            Assert.Equal(locations[2].GetCsvValues(),viewModelLocations[locations[2].Id]);
            Assert.Equal(locations[3].GetCsvValues(),viewModelLocations[locations[3].Id]);
        }
    }

    [Fact]
    public async Task GetCsvSubjectMeta_OnlyFiltersItemsWithObservations()
    {
        var fixture = new DataFixture();

        var releaseSubject = new ReleaseSubject
        {
            Release = fixture.DefaultRelease(),
            Subject = fixture.DefaultSubject(),
        };

        var releaseFile = new ReleaseFile
        {
            Release = new Content.Model.Release
            {
                Id = releaseSubject.Release.Id,
            },
            File = new File
            {
                SubjectId = releaseSubject.Subject.Id
            }
        };

        var filterItems = fixture.DefaultFilterItem().GenerateArray(10);
        var filters = fixture.DefaultFilter()
            .WithSubject(releaseSubject.Subject)
            .WithFilterGroups(
                ..1,
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems[..2])
                    .Generate(1)
            )
            .WithFilterGroups(
                1..2,
                fixture.DefaultFilterGroup()
                    .WithFilterItems(..1, filterItems[2..4])
                    .WithFilterItems(1..2, filterItems[4..6])
                    .Generate(2)
            )
            .WithFilterGroups(
                2..3,
                fixture.DefaultFilterGroup()
                    .WithFilterItems(..1, filterItems[6..8])
                    .WithFilterItems(1..2, filterItems[8..10])
                    .Generate(2)
            )
            .GenerateList(3);

        var indicators = fixture.DefaultIndicator()
            .WithIndicatorGroup(fixture.DefaultIndicatorGroup()
                .WithSubject(releaseSubject.Subject))
            .GenerateList(3);

        var observations = fixture.DefaultObservation()
            .WithSubject(releaseSubject.Subject)
            .WithLocation(fixture.DefaultLocation())
            .WithMeasures(indicators)
            .ForRange(..1, o => o
                .SetFilterItems(filterItems[0], filterItems[4], filterItems[6]))
            .ForRange(1..1, o => o
                .SetFilterItems(filterItems[1], filterItems[5], filterItems[7]))
            .GenerateList(2);

        var contextId = Guid.NewGuid().ToString();

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            await contentDbContext.ReleaseFiles.AddRangeAsync(releaseFile);
            await contentDbContext.SaveChangesAsync();

            await statisticsDbContext.ReleaseSubject.AddRangeAsync(releaseSubject);
            await statisticsDbContext.Filter.AddRangeAsync(filters);
            await statisticsDbContext.Indicator.AddRangeAsync(indicators);
            await statisticsDbContext.Observation.AddRangeAsync(observations);
            await statisticsDbContext.SaveChangesAsync();
        }

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            var releaseFileBlobService = new Mock<IReleaseFileBlobService>(Strict);

            // Stubbing this out as testing headers in other methods
            releaseFileBlobService
                .Setup(s =>
                    s.StreamBlob(It.IsAny<ReleaseFile>(), null, default))
                .ReturnsAsync("csv_header".ToStream());

            var service = BuildService(
                statisticsDbContext: statisticsDbContext,
                contentDbContext: contentDbContext,
                releaseFileBlobService: releaseFileBlobService.Object);

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.SubjectId,
                Indicators = indicators.Select(i => i.Id)
            };

            var result =
                await service.GetSubjectCsvMeta(releaseSubject, query, observations);

            VerifyAllMocks(releaseFileBlobService);

            var viewModel = result.AssertRight();

            var viewModelFilter0 = viewModel.Filters[filters[0].Name];
            var viewModelFilter1 = viewModel.Filters[filters[1].Name];
            var viewModelFilter2 = viewModel.Filters[filters[2].Name];

            Assert.Equal(3, viewModel.Filters.Count);
            Assert.Equal(filters[0].Id, viewModelFilter0.Id);
            Assert.Equal(filters[1].Id, viewModelFilter1.Id);
            Assert.Equal(filters[2].Id, viewModelFilter2.Id);

            var viewModelFilter0Items = viewModelFilter0.Items;
            Assert.Equal(2, viewModelFilter0Items.Count);
            Assert.Equal(filterItems[0].Id, viewModelFilter0Items[filterItems[0].Id].Id);

            var viewModelFilter1Items = viewModelFilter1.Items;
            Assert.Equal(2, viewModelFilter1Items.Count);
            Assert.Equal(filterItems[4].Id, viewModelFilter1Items[filterItems[4].Id].Id);
            Assert.Equal(filterItems[5].Id, viewModelFilter1Items[filterItems[5].Id].Id);

            var viewModelFilter2Items = viewModelFilter2.Items;
            Assert.Equal(2, viewModelFilter2Items.Count);
            Assert.Equal(filterItems[6].Id, viewModelFilter2Items[filterItems[6].Id].Id);
            Assert.Equal(filterItems[7].Id, viewModelFilter2Items[filterItems[7].Id].Id);
        }
    }

    [Fact]
    public async Task GetCsvSubjectMeta_OnlyIndicatorsFromQuery()
    {
        var fixture = new DataFixture();

        var releaseSubject = new ReleaseSubject
        {
            Release = fixture.DefaultRelease(),
            Subject = fixture.DefaultSubject(),
        };

        var releaseFile = new ReleaseFile
        {
            Release = new Content.Model.Release
            {
                Id = releaseSubject.Release.Id,
            },
            File = new File
            {
                SubjectId = releaseSubject.Subject.Id
            }
        };

        var filterItems = fixture.DefaultFilterItem().GenerateList(1);
        var filters = fixture.DefaultFilter()
            .WithSubject(releaseSubject.Subject)
            .WithFilterGroups(
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems)
                    .Generate(1)
            )
            .GenerateList(1);

        var indicators = fixture.DefaultIndicator()
            .WithIndicatorGroup(
            ..2,
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject))
            .WithIndicatorGroup(
                2..4,
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject))
            .WithIndicatorGroup(
                4..6,
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject))
            .GenerateArray(6);

        var observations = fixture.DefaultObservation()
            .WithSubject(releaseSubject.Subject)
            .WithLocation(fixture.DefaultLocation())
            .WithFilterItems(filterItems)
            .WithMeasures(indicators)
            .GenerateList(2);

        var contextId = Guid.NewGuid().ToString();

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            await contentDbContext.ReleaseFiles.AddRangeAsync(releaseFile);
            await contentDbContext.SaveChangesAsync();

            await statisticsDbContext.ReleaseSubject.AddRangeAsync(releaseSubject);
            await statisticsDbContext.Filter.AddRangeAsync(filters);
            await statisticsDbContext.Indicator.AddRangeAsync(indicators);
            await statisticsDbContext.Observation.AddRangeAsync(observations);
            await statisticsDbContext.SaveChangesAsync();
        }

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            var releaseFileBlobService = new Mock<IReleaseFileBlobService>(Strict);

            // Stubbing this out as testing headers in other methods
            releaseFileBlobService
                .Setup(s =>
                    s.StreamBlob(It.IsAny<ReleaseFile>(), null, default))
                .ReturnsAsync("csv_header".ToStream());

            var service = BuildService(
                statisticsDbContext: statisticsDbContext,
                contentDbContext: contentDbContext,
                releaseFileBlobService: releaseFileBlobService.Object);

            // Only indicators from the query will be included in the meta
            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.SubjectId,
                Indicators = indicators[1..2]
                    .Concat(indicators[4..6])
                    .Select(i => i.Id)
            };

            var result =
                await service.GetSubjectCsvMeta(releaseSubject, query, observations);

            VerifyAllMocks(releaseFileBlobService);

            var viewModel = result.AssertRight();

            Assert.Equal(3, viewModel.Indicators.Count);
            Assert.Equal(indicators[1].Id, viewModel.Indicators[indicators[1].Name].Id);
            Assert.Equal(indicators[4].Id, viewModel.Indicators[indicators[4].Name].Id);
            Assert.Equal(indicators[5].Id, viewModel.Indicators[indicators[5].Name].Id);
        }
    }

    [Fact]
    public async Task GetCsvSubjectMeta_NoIndicatorsFromQuery()
    {
        var fixture = new DataFixture();

        var releaseSubject = new ReleaseSubject
        {
            Release = fixture.DefaultRelease(),
            Subject = fixture.DefaultSubject(),
        };

        var releaseFile = new ReleaseFile
        {
            Release = new Content.Model.Release
            {
                Id = releaseSubject.Release.Id,
            },
            File = new File
            {
                SubjectId = releaseSubject.Subject.Id
            }
        };

        var filterItems = fixture.DefaultFilterItem().GenerateList(1);
        var filters = fixture.DefaultFilter()
            .WithSubject(releaseSubject.Subject)
            .WithFilterGroups(
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems)
                    .Generate(1)
            )
            .GenerateList(1);

        var indicators = fixture.DefaultIndicator()
            .WithIndicatorGroup(
                ..2,
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject)
            )
            .WithIndicatorGroup(
                2..4,
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject)
            )
            .GenerateList(4);

        var observations = fixture.DefaultObservation()
            .WithSubject(releaseSubject.Subject)
            .WithLocation(fixture.DefaultLocation())
            .WithFilterItems(filterItems)
            .WithMeasures(indicators)
            .GenerateList(2);

        var contextId = Guid.NewGuid().ToString();

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            await contentDbContext.ReleaseFiles.AddRangeAsync(releaseFile);
            await contentDbContext.SaveChangesAsync();

            await statisticsDbContext.ReleaseSubject.AddRangeAsync(releaseSubject);
            await statisticsDbContext.Filter.AddRangeAsync(filters);
            await statisticsDbContext.Indicator.AddRangeAsync(indicators);
            await statisticsDbContext.Observation.AddRangeAsync(observations);
            await statisticsDbContext.SaveChangesAsync();
        }

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            var releaseFileBlobService = new Mock<IReleaseFileBlobService>(Strict);

            // Stubbing this out as testing headers in other methods
            releaseFileBlobService
                .Setup(
                    s =>
                        s.StreamBlob(It.IsAny<ReleaseFile>(), null, default)
                )
                .ReturnsAsync("csv_header".ToStream());

            var service = BuildService(
                statisticsDbContext: statisticsDbContext,
                contentDbContext: contentDbContext,
                releaseFileBlobService: releaseFileBlobService.Object
            );

            // Indicator ids don't match any in the database
            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.SubjectId,
                Indicators = ListOf(Guid.NewGuid(), Guid.NewGuid())
            };

            var result =
                await service.GetSubjectCsvMeta(releaseSubject, query, observations);

            VerifyAllMocks(releaseFileBlobService);

            var viewModel = result.AssertRight();

            // No indicators match, so none are in the meta
            Assert.Empty(viewModel.Indicators);
        }
    }

    [Fact]
    public async Task GetCsvSubjectMeta_OnlyLocationsWithObservations()
    {
        var fixture = new DataFixture();

        var releaseSubject = new ReleaseSubject
        {
            Release = fixture.DefaultRelease(),
            Subject = fixture.DefaultSubject(),
        };

        var releaseFile = new ReleaseFile
        {
            Release = new Content.Model.Release
            {
                Id = releaseSubject.Release.Id,
            },
            File = new File
            {
                SubjectId = releaseSubject.Subject.Id
            }
        };

        var filterItems = fixture.DefaultFilterItem().GenerateList(1);
        var filters = fixture.DefaultFilter()
            .WithSubject(releaseSubject.Subject)
            .WithFilterGroups(
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems)
                    .Generate(1)
            )
            .GenerateList(1);

        var indicators = fixture.DefaultIndicator()
            .WithIndicatorGroup(fixture.DefaultIndicatorGroup()
                .WithSubject(releaseSubject.Subject))
            .GenerateList(3);

        var locations = fixture.DefaultLocation()
            .ForRange(..2, l => l.SetPresetRegion())
            .ForRange(2..4, l => l.SetPresetRegionAndLocalAuthority())
            .GenerateList(4);

        var observations = fixture.DefaultObservation()
            .WithSubject(releaseSubject.Subject)
            .WithFilterItems(filterItems)
            .WithMeasures(indicators)
            .ForRange(..2, o => o
                .SetLocation(locations[0]))
            .ForRange(2..4, o => o
                .SetLocation(locations[3]))
            .GenerateList(4);

        var contextId = Guid.NewGuid().ToString();

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            await contentDbContext.ReleaseFiles.AddRangeAsync(releaseFile);
            await contentDbContext.SaveChangesAsync();

            await statisticsDbContext.ReleaseSubject.AddRangeAsync(releaseSubject);
            await statisticsDbContext.Filter.AddRangeAsync(filters);
            await statisticsDbContext.Indicator.AddRangeAsync(indicators);
            await statisticsDbContext.Location.AddRangeAsync(locations);
            await statisticsDbContext.Observation.AddRangeAsync(observations);
            await statisticsDbContext.SaveChangesAsync();
        }

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            var releaseFileBlobService = new Mock<IReleaseFileBlobService>(Strict);

            // Stubbing this out as testing headers in other methods
            releaseFileBlobService
                .Setup(s =>
                    s.StreamBlob(It.IsAny<ReleaseFile>(), null, default))
                .ReturnsAsync("csv_header".ToStream());

            var service = BuildService(
                statisticsDbContext: statisticsDbContext,
                contentDbContext: contentDbContext,
                releaseFileBlobService: releaseFileBlobService.Object);

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.SubjectId,
                Indicators = indicators.Select(i => i.Id)
            };

            var result =
                await service.GetSubjectCsvMeta(releaseSubject, query, observations);

            VerifyAllMocks(releaseFileBlobService);

            var viewModel = result.AssertRight();

            Assert.Equal(2, viewModel.Locations.Count);
            Assert.Equal(locations[0].GetCsvValues(), viewModel.Locations[locations[0].Id]);
            Assert.Equal(locations[3].GetCsvValues(), viewModel.Locations[locations[3].Id]);
        }
    }

    [Fact]
    public async Task GetCsvSubjectMeta_EmptyObservations()
    {
        var fixture = new DataFixture();

        var releaseSubject = new ReleaseSubject
        {
            Release = fixture.DefaultRelease(),
            Subject = fixture.DefaultSubject(),
        };

        var releaseFile = new ReleaseFile
        {
            Release = new Content.Model.Release
            {
                Id = releaseSubject.Release.Id,
            },
            File = new File
            {
                SubjectId = releaseSubject.Subject.Id
            }
        };

        var filterItems = fixture.DefaultFilterItem().GenerateArray(1);
        var filters = fixture.DefaultFilter()
            .WithSubject(releaseSubject.Subject)
            .WithFilterGroups(
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems)
                    .Generate(1)
            )
            .GenerateList(1);

        var indicators = fixture.DefaultIndicator()
            .WithIndicatorGroup(fixture.DefaultIndicatorGroup()
                .WithSubject(releaseSubject.Subject))
            .GenerateList(3);

        var locations = fixture.DefaultLocation()
            .ForRange(..2, l => l.SetPresetRegion())
            .ForRange(2..4, l => l.SetPresetRegionAndLocalAuthority())
            .GenerateList(4);

        var contextId = Guid.NewGuid().ToString();

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            await contentDbContext.ReleaseFiles.AddRangeAsync(releaseFile);
            await contentDbContext.SaveChangesAsync();

            await statisticsDbContext.ReleaseSubject.AddRangeAsync(releaseSubject);
            await statisticsDbContext.Filter.AddRangeAsync(filters);
            await statisticsDbContext.Indicator.AddRangeAsync(indicators);
            await statisticsDbContext.Location.AddRangeAsync(locations);
            await statisticsDbContext.SaveChangesAsync();
        }

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            var releaseFileBlobService = new Mock<IReleaseFileBlobService>(Strict);

            // Stubbing this out as testing headers in other methods
            releaseFileBlobService
                .Setup(s =>
                    s.StreamBlob(It.IsAny<ReleaseFile>(), null, default))
                .ReturnsAsync("csv_header".ToStream());

            var service = BuildService(
                statisticsDbContext: statisticsDbContext,
                contentDbContext: contentDbContext,
                releaseFileBlobService: releaseFileBlobService.Object);

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.SubjectId,
            };

            var result =
                await service.GetSubjectCsvMeta(releaseSubject, query, new List<Observation>());

            VerifyAllMocks(releaseFileBlobService);

            var viewModel = result.AssertRight();

            Assert.Empty(viewModel.Filters);
            Assert.Empty(viewModel.Indicators);
            Assert.Empty(viewModel.Locations);
        }
    }

    [Fact]
    public async Task GetCsvSubjectMeta_Headers()
    {
        var fixture = new DataFixture();

        var releaseSubject = new ReleaseSubject
        {
            Release = fixture.DefaultRelease(),
            Subject = fixture.DefaultSubject(),
        };

        var releaseFile = new ReleaseFile
        {
            Release = new Content.Model.Release
            {
                Id = releaseSubject.Release.Id,
            },
            File = new File
            {
                SubjectId = releaseSubject.Subject.Id
            }
        };

        var filterItems = fixture.DefaultFilterItem().GenerateArray(2);
        var filters = fixture.DefaultFilter()
            .WithSubject(releaseSubject.Subject)
            .WithFilterGroups(
                ..1,
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems[0])
                    .Generate(1))
            .WithFilterGroups(
                1..2,
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems[1])
                    .Generate(1))
            .GenerateList(2);

        var indicators = fixture.DefaultIndicator()
            .WithIndicatorGroup(
                ..1,
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject))
            .WithIndicatorGroup(
                1..3,
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject))
            .GenerateList(3);

        var observations = fixture.DefaultObservation()
            .ForInstance(o => o
                .SetSubject(releaseSubject.Subject)
                .SetMeasures(indicators)
                .SetFilterItems(filterItems[0], filterItems[1])
                .SetLocation(fixture.DefaultLocation().WithPresetRegionAndLocalAuthority())
                .SetTimePeriod(2022, AcademicYear))
            .GenerateList(1);

        var contextId = Guid.NewGuid().ToString();

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            await contentDbContext.ReleaseFiles.AddRangeAsync(releaseFile);
            await contentDbContext.SaveChangesAsync();

            await statisticsDbContext.ReleaseSubject.AddRangeAsync(releaseSubject);
            await statisticsDbContext.Filter.AddRangeAsync(filters);
            await statisticsDbContext.Indicator.AddRangeAsync(indicators);
            await statisticsDbContext.Observation.AddRangeAsync(observations);
            await statisticsDbContext.SaveChangesAsync();
        }

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            var csv = new StringBuilder("time_period,time_identifier")
                .Append(",country_code,country_name")
                .Append(",region_code,region_name")
                .Append(",new_la_code,old_la_code,la_name")
                .Append(@$",""{filters[0].Name}"",""{filters[1].Name}""")
                .Append(@$",""{indicators[0].Name}"",""{indicators[1].Name}"",""{indicators[2].Name}""");

            var releaseFileBlobService = new Mock<IReleaseFileBlobService>(Strict);

            releaseFileBlobService
                .Setup(
                    s => s.StreamBlob(
                        It.Is<ReleaseFile>(
                            rf => rf.FileId == releaseFile.FileId && rf.ReleaseId == releaseFile.ReleaseId
                        ),
                        null,
                        default
                    )
                )
                .ReturnsAsync(csv.ToString().ToStream());

            var service = BuildService(
                statisticsDbContext: statisticsDbContext,
                contentDbContext: contentDbContext,
                releaseFileBlobService: releaseFileBlobService.Object);

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.SubjectId,
                Indicators = indicators.Select(i => i.Id).ToList()
            };

            var result =
                await service.GetSubjectCsvMeta(releaseSubject, query, observations);

            VerifyAllMocks(releaseFileBlobService);

            var viewModel = result.AssertRight();

            Assert.Equal(14, viewModel.Headers.Count);
            Assert.Equal("time_period", viewModel.Headers[0]);
            Assert.Equal("time_identifier", viewModel.Headers[1]);
            Assert.Equal("country_code", viewModel.Headers[2]);
            Assert.Equal("country_name", viewModel.Headers[3]);
            Assert.Equal("region_code", viewModel.Headers[4]);
            Assert.Equal("region_name", viewModel.Headers[5]);
            Assert.Equal("new_la_code", viewModel.Headers[6]);
            Assert.Equal("old_la_code", viewModel.Headers[7]);
            Assert.Equal("la_name", viewModel.Headers[8]);
            Assert.Equal(filters[0].Name, viewModel.Headers[9]);
            Assert.Equal(filters[1].Name, viewModel.Headers[10]);
            Assert.Equal(indicators[0].Name, viewModel.Headers[11]);
            Assert.Equal(indicators[1].Name, viewModel.Headers[12]);
            Assert.Equal(indicators[2].Name, viewModel.Headers[13]);
        }
    }

    [Fact]
    public async Task GetCsvSubjectMeta_Headers_OnlyIndicatorsFromQuery()
    {
        var fixture = new DataFixture();

        var releaseSubject = new ReleaseSubject
        {
            Release = fixture.DefaultRelease(),
            Subject = fixture.DefaultSubject(),
        };

        var releaseFile = new ReleaseFile
        {
            Release = new Content.Model.Release
            {
                Id = releaseSubject.Release.Id,
            },
            File = new File
            {
                SubjectId = releaseSubject.Subject.Id
            }
        };

        var filterItems = fixture.DefaultFilterItem().GenerateArray(1);
        var filters = fixture.DefaultFilter()
            .WithSubject(releaseSubject.Subject)
            .WithFilterGroups(
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems[0])
                    .Generate(1))
            .GenerateList(1);

        var indicators = fixture.DefaultIndicator()
            .WithIndicatorGroup(
                ..2,
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject))
            .WithIndicatorGroup(
                2..4,
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject))
            .GenerateList(4);

        var observations = fixture.DefaultObservation()
            .ForInstance(o => o
                .SetSubject(releaseSubject.Subject)
                .SetMeasures(indicators)
                .SetFilterItems(filterItems[0])
                .SetLocation(fixture.DefaultLocation())
                .SetTimePeriod(2022, AcademicYear))
            .GenerateList(1);

        var contextId = Guid.NewGuid().ToString();

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            await contentDbContext.ReleaseFiles.AddRangeAsync(releaseFile);
            await contentDbContext.SaveChangesAsync();

            await statisticsDbContext.ReleaseSubject.AddRangeAsync(releaseSubject);
            await statisticsDbContext.Filter.AddRangeAsync(filters);
            await statisticsDbContext.Indicator.AddRangeAsync(indicators);
            await statisticsDbContext.Observation.AddRangeAsync(observations);
            await statisticsDbContext.SaveChangesAsync();
        }

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            var csv = new StringBuilder("time_period,time_identifier")
                .Append(",country_code,country_name")
                .Append(@$",""{filters[0].Name}""")
                .Append(@$",""{indicators[0].Name}"",""{indicators[1].Name}"",""{indicators[2].Name}"",""{indicators[3].Name}""");

            var releaseFileBlobService = new Mock<IReleaseFileBlobService>(Strict);

            releaseFileBlobService
                .Setup(
                    s => s.StreamBlob(
                        It.Is<ReleaseFile>(
                            rf => rf.FileId == releaseFile.FileId && rf.ReleaseId == releaseFile.ReleaseId
                        ),
                        null,
                        default
                    )
                )
                .ReturnsAsync(csv.ToString().ToStream());

            var service = BuildService(
                statisticsDbContext: statisticsDbContext,
                contentDbContext: contentDbContext,
                releaseFileBlobService: releaseFileBlobService.Object);

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.SubjectId,
                Indicators = ListOf(indicators[1].Id, indicators[3].Id)
            };

            var result =
                await service.GetSubjectCsvMeta(releaseSubject, query, observations);

            VerifyAllMocks(releaseFileBlobService);

            var viewModel = result.AssertRight();

            Assert.Equal(7, viewModel.Headers.Count);
            Assert.Equal("time_period", viewModel.Headers[0]);
            Assert.Equal("time_identifier", viewModel.Headers[1]);
            Assert.Equal("country_code", viewModel.Headers[2]);
            Assert.Equal("country_name", viewModel.Headers[3]);
            Assert.Equal(filters[0].Name, viewModel.Headers[4]);
            // Only indicators specified in the query will be in the meta's CSV headers
            Assert.Equal(indicators[1].Name, viewModel.Headers[5]);
            Assert.Equal(indicators[3].Name, viewModel.Headers[6]);
        }
    }

    [Fact]
    public async Task GetCsvSubjectMeta_Headers_NoIndicatorsFromQuery()
    {
        var fixture = new DataFixture();

        var releaseSubject = new ReleaseSubject
        {
            Release = fixture.DefaultRelease(),
            Subject = fixture.DefaultSubject(),
        };

        var releaseFile = new ReleaseFile
        {
            Release = new Content.Model.Release
            {
                Id = releaseSubject.Release.Id,
            },
            File = new File
            {
                SubjectId = releaseSubject.Subject.Id
            }
        };

        var filterItems = fixture.DefaultFilterItem().GenerateArray(1);
        var filters = fixture.DefaultFilter()
            .WithSubject(releaseSubject.Subject)
            .WithFilterGroups(
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems[0])
                    .Generate(1))
            .GenerateList(1);

        var indicators = fixture.DefaultIndicator()
            .WithIndicatorGroup(
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject))
            .GenerateList(2);

        var observations = fixture.DefaultObservation()
            .ForInstance(o => o
                .SetSubject(releaseSubject.Subject)
                .SetMeasures(indicators)
                .SetFilterItems(filterItems[0])
                .SetLocation(fixture.DefaultLocation())
                .SetTimePeriod(2022, AcademicYear))
            .GenerateList(1);

        var contextId = Guid.NewGuid().ToString();

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            await contentDbContext.ReleaseFiles.AddRangeAsync(releaseFile);
            await contentDbContext.SaveChangesAsync();

            await statisticsDbContext.ReleaseSubject.AddRangeAsync(releaseSubject);
            await statisticsDbContext.Filter.AddRangeAsync(filters);
            await statisticsDbContext.Indicator.AddRangeAsync(indicators);
            await statisticsDbContext.Observation.AddRangeAsync(observations);
            await statisticsDbContext.SaveChangesAsync();
        }

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            var csv = new StringBuilder("time_period,time_identifier")
                .Append(",country_code,country_name")
                .Append(@$",""{filters[0].Name}""")
                .Append(@$",""{indicators[0].Name}"",""{indicators[1].Name}""");

            var releaseFileBlobService = new Mock<IReleaseFileBlobService>(Strict);

            releaseFileBlobService
                .Setup(
                    s => s.StreamBlob(
                        It.Is<ReleaseFile>(
                            rf => rf.FileId == releaseFile.FileId && rf.ReleaseId == releaseFile.ReleaseId
                        ),
                        null,
                        default
                    )
                )
                .ReturnsAsync(csv.ToString().ToStream());

            var service = BuildService(
                statisticsDbContext: statisticsDbContext,
                contentDbContext: contentDbContext,
                releaseFileBlobService: releaseFileBlobService.Object);

            // Indicator ids don't matching any saved in the database
            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.SubjectId,
                Indicators = ListOf(Guid.NewGuid(), Guid.NewGuid())
            };

            var result =
                await service.GetSubjectCsvMeta(releaseSubject, query, observations);

            VerifyAllMocks(releaseFileBlobService);

            var viewModel = result.AssertRight();

            Assert.Equal(5, viewModel.Headers.Count);
            Assert.Equal("time_period", viewModel.Headers[0]);
            Assert.Equal("time_identifier", viewModel.Headers[1]);
            Assert.Equal("country_code", viewModel.Headers[2]);
            Assert.Equal("country_name", viewModel.Headers[3]);
            Assert.Equal(filters[0].Name, viewModel.Headers[4]);
        }
    }

    [Fact]
    public async Task GetCsvSubjectMeta_Headers_DoNotMatchAnyMeta()
    {
        var fixture = new DataFixture();

        var releaseSubject = new ReleaseSubject
        {
            Release = fixture.DefaultRelease(),
            Subject = fixture.DefaultSubject(),
        };

        var releaseFile = new ReleaseFile
        {
            Release = new Content.Model.Release
            {
                Id = releaseSubject.Release.Id,
            },
            File = new File
            {
                SubjectId = releaseSubject.Subject.Id
            }
        };

        var filterItems = fixture.DefaultFilterItem().GenerateArray(2);
        var filters = fixture.DefaultFilter()
            .WithSubject(releaseSubject.Subject)
            .WithFilterGroups(
                fixture.DefaultFilterGroup()
                    .WithFilterItems(filterItems[0])
                    .Generate(1))
            .GenerateList(1);

        var indicators = fixture.DefaultIndicator()
            .WithIndicatorGroup(
                fixture.DefaultIndicatorGroup()
                    .WithSubject(releaseSubject.Subject))
            .GenerateList(2);

        var observations = fixture.DefaultObservation()
            .ForInstance(o => o
                .SetSubject(releaseSubject.Subject)
                .SetMeasures(indicators)
                .SetFilterItems(filterItems[0])
                .SetLocation(fixture.DefaultLocation())
                .SetTimePeriod(2022, AcademicYear))
            .GenerateList(1);

        var contextId = Guid.NewGuid().ToString();

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            await contentDbContext.ReleaseFiles.AddRangeAsync(releaseFile);
            await contentDbContext.SaveChangesAsync();

            await statisticsDbContext.ReleaseSubject.AddRangeAsync(releaseSubject);
            await statisticsDbContext.Filter.AddRangeAsync(filters);
            await statisticsDbContext.Indicator.AddRangeAsync(indicators);
            await statisticsDbContext.Observation.AddRangeAsync(observations);
            await statisticsDbContext.SaveChangesAsync();
        }

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            // CSV contains headers that don't correspond to any meta
            var csv = new StringBuilder("time_period,time_identifier")
                .Append(",country_code,country_name")
                .Append(",some_header")
                .Append(@$",""{filters[0].Name}""")
                .Append(",another_header")
                .Append(@$",""{indicators[0].Name}"",""{indicators[1].Name}""")
                .Append(",last_header");

            var releaseFileBlobService = new Mock<IReleaseFileBlobService>(Strict);

            releaseFileBlobService
                .Setup(
                    s => s.StreamBlob(
                        It.Is<ReleaseFile>(
                            rf => rf.FileId == releaseFile.FileId && rf.ReleaseId == releaseFile.ReleaseId
                        ),
                        null,
                        default
                    )
                )
                .ReturnsAsync(csv.ToString().ToStream());

            var service = BuildService(
                statisticsDbContext: statisticsDbContext,
                contentDbContext: contentDbContext,
                releaseFileBlobService: releaseFileBlobService.Object);

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.SubjectId,
                Indicators = indicators.Select(i => i.Id)
            };

            var result =
                await service.GetSubjectCsvMeta(releaseSubject, query, observations);

            VerifyAllMocks(releaseFileBlobService);

            var viewModel = result.AssertRight();

            Assert.Equal(7, viewModel.Headers.Count);
            Assert.Equal("time_period", viewModel.Headers[0]);
            Assert.Equal("time_identifier", viewModel.Headers[1]);
            Assert.Equal("country_code", viewModel.Headers[2]);
            Assert.Equal("country_name", viewModel.Headers[3]);
            Assert.Equal(filters[0].Name, viewModel.Headers[4]);
            Assert.Equal(indicators[0].Name, viewModel.Headers[5]);
            Assert.Equal(indicators[1].Name, viewModel.Headers[6]);
        }
    }

    [Fact]
    public async Task GetCsvSubjectMeta_ReleaseFileNotFound()
    {
        var releaseSubject = new ReleaseSubject
        {
            Release = new Release { Id = Guid.NewGuid() },
            Subject = new Subject { Id = Guid.NewGuid() }
        };

        var releaseFile = new ReleaseFile
        {
            Release = new Content.Model.Release(),
            File = new File { SubjectId = Guid.NewGuid() }
        };

        var contextId = Guid.NewGuid().ToString();

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            await contentDbContext.ReleaseFiles.AddRangeAsync(releaseFile);
            await contentDbContext.SaveChangesAsync();

            await statisticsDbContext.ReleaseSubject.AddRangeAsync(releaseSubject);
            await statisticsDbContext.SaveChangesAsync();
        }

        await using (var contentDbContext = InMemoryContentDbContext(contextId))
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(contextId))
        {
            var service = BuildService(
                statisticsDbContext: statisticsDbContext,
                contentDbContext: contentDbContext);

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.SubjectId,
            };

            var result =
                await service.GetSubjectCsvMeta(releaseSubject, query, new List<Observation>());

            result.AssertNotFound();
        }
    }

    private static void AssertIndicatorCsvViewModel(Indicator indicator, IndicatorCsvMetaViewModel viewModel)
    {
        Assert.Equal(indicator.Id, viewModel.Id);
        Assert.Equal(indicator.Name, viewModel.Name);
        Assert.Equal(indicator.Label, viewModel.Label);
        Assert.Equal(indicator.DecimalPlaces, viewModel.DecimalPlaces);
        Assert.Equal(indicator.Unit, viewModel.Unit);
    }

    private static SubjectCsvMetaService BuildService(
        StatisticsDbContext statisticsDbContext,
        ContentDbContext contentDbContext,
        IReleaseFileBlobService? releaseFileBlobService = null)
    {
        return new SubjectCsvMetaService(
            statisticsDbContext: statisticsDbContext,
            contentDbContext: contentDbContext,
            userService: AlwaysTrueUserService().Object,
            filterItemRepository: new FilterItemRepository(statisticsDbContext),
            releaseFileBlobService: releaseFileBlobService ?? Mock.Of<IReleaseFileBlobService>()
        );
    }
}
