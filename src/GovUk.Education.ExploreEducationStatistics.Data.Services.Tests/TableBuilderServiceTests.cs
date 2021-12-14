#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Common.Model;
using GovUk.Education.ExploreEducationStatistics.Common.Model.Data.Query;
using GovUk.Education.ExploreEducationStatistics.Common.Services.Interfaces.Security;
using GovUk.Education.ExploreEducationStatistics.Common.Tests.Extensions;
using GovUk.Education.ExploreEducationStatistics.Common.Tests.Utils;
using GovUk.Education.ExploreEducationStatistics.Common.Utils;
using GovUk.Education.ExploreEducationStatistics.Data.Model;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Query;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Repository.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Services.Tests.Utils;
using GovUk.Education.ExploreEducationStatistics.Data.Services.ViewModels;
using GovUk.Education.ExploreEducationStatistics.Data.Services.ViewModels.Meta;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;
using static GovUk.Education.ExploreEducationStatistics.Common.Tests.Utils.MockUtils;
using Release = GovUk.Education.ExploreEducationStatistics.Data.Model.Release;

namespace GovUk.Education.ExploreEducationStatistics.Data.Services.Tests
{
    public class TableBuilderServiceTests
    {
        [Fact]
        public async Task Query_LatestRelease()
        {
            var publicationId = Guid.NewGuid();

            var release = new Release
            {
                PublicationId = publicationId,
            };

            var releaseSubject = new ReleaseSubject
            {
                Release = release,
                Subject = new Subject
                {
                    Id = Guid.NewGuid()
                }
            };

            var indicator1Id = Guid.NewGuid();
            var indicator2Id = Guid.NewGuid();

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.Subject.Id,
                Indicators = new[] {indicator1Id, indicator2Id,},
                Locations = new LocationQuery
                {
                    Country = new List<string>
                    {
                        "england"
                    }
                },
                TimePeriod = new TimePeriodQuery
                {
                    StartYear = 2019,
                    StartCode = TimeIdentifier.AcademicYear,
                    EndYear = 2020,
                    EndCode = TimeIdentifier.AcademicYear,
                }
            };

            var contextId = Guid.NewGuid().ToString();

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                await statisticsDbContext.AddAsync(releaseSubject);
                await statisticsDbContext.SaveChangesAsync();
            }

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                var observations = new List<Observation>
                {
                    new()
                    {
                        Measures = new Dictionary<Guid, string>
                        {
                            {indicator1Id, "123"},
                            {indicator2Id, "456"},
                        },
                        FilterItems = new List<ObservationFilterItem>(),
                        Year = 2019,
                        TimeIdentifier = TimeIdentifier.AcademicYear,
                    },
                    new()
                    {
                        Measures = new Dictionary<Guid, string>
                        {
                            { indicator1Id, "789" },
                            { Guid.NewGuid(), "1123" },
                            { Guid.NewGuid(), "1456" },
                        },
                        FilterItems = new List<ObservationFilterItem>(),
                        Year = 2020,
                        TimeIdentifier = TimeIdentifier.AcademicYear,
                    },
                };

                var subjectMeta = new ResultSubjectMetaViewModel
                {
                    Indicators = new List<IndicatorMetaViewModel>
                    {
                        new()
                        {
                            Label = "Test indicator"
                        }
                    },
                };

                var observationService = new Mock<IObservationService>(MockBehavior.Strict);

                observationService
                    .Setup(s => s.FindObservations(query, default))
                    .ReturnsAsync(observations);

                var resultSubjectMetaService = new Mock<IResultSubjectMetaService>(MockBehavior.Strict);

                resultSubjectMetaService
                    .Setup(
                        s => s.GetSubjectMeta(
                            release.Id,
                            It.IsAny<SubjectMetaQueryContext>(),
                            It.IsAny<IList<Observation>>()
                        )
                    )
                    .ReturnsAsync(subjectMeta);

                var subjectRepository = new Mock<ISubjectRepository>(MockBehavior.Strict);

                subjectRepository
                    .Setup(s => s.GetPublicationIdForSubject(query.SubjectId))
                    .ReturnsAsync(publicationId);

                subjectRepository
                    .Setup(s => s.IsSubjectForLatestPublishedRelease(query.SubjectId))
                    .ReturnsAsync(true);

                var releaseRepository = new Mock<IReleaseRepository>(MockBehavior.Strict);

                releaseRepository
                    .Setup(s => s.GetLatestPublishedRelease(publicationId))
                    .Returns(release);

                var service = BuildTableBuilderService(
                    statisticsDbContext,
                    observationService: observationService.Object,
                    resultSubjectMetaService: resultSubjectMetaService.Object,
                    subjectRepository: subjectRepository.Object,
                    releaseRepository: releaseRepository.Object
                );

                var result = await service.Query(query);

                VerifyAllMocks(
                    observationService,
                    resultSubjectMetaService,
                    subjectRepository,
                    releaseRepository);

                var observationResults = result.AssertRight().Results.ToList();

                Assert.Equal(2, observationResults.Count);

                Assert.Equal("2019_AY", observationResults[0].TimePeriod);
                Assert.Equal(2, observationResults[0].Measures.Count);
                Assert.Equal("123", observationResults[0].Measures[indicator1Id.ToString()]);
                Assert.Equal("456", observationResults[0].Measures[indicator2Id.ToString()]);

                Assert.Equal("2020_AY", observationResults[1].TimePeriod);
                Assert.Single(observationResults[1].Measures);
                Assert.Equal("789", observationResults[1].Measures[indicator1Id.ToString()]);

                Assert.Equal(subjectMeta, result.Right.SubjectMeta);
            }
        }

        [Fact]
        public async Task Query_LatestRelease_ReleaseNotFound()
        {
            var publicationId = Guid.NewGuid();

            var query = new ObservationQueryContext
            {
                SubjectId = Guid.NewGuid(),
            };

            var contextId = Guid.NewGuid().ToString();

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                var subjectRepository = new Mock<ISubjectRepository>(MockBehavior.Strict);

                subjectRepository
                    .Setup(s => s.GetPublicationIdForSubject(query.SubjectId))
                    .ReturnsAsync(publicationId);

                var releaseRepository = new Mock<IReleaseRepository>(MockBehavior.Strict);

                releaseRepository
                    .Setup(s => s.GetLatestPublishedRelease(publicationId))
                    .Returns((Release?) null);

                var service = BuildTableBuilderService(
                    statisticsDbContext,
                    subjectRepository: subjectRepository.Object,
                    releaseRepository: releaseRepository.Object
                );

                var result = await service.Query(query);

                VerifyAllMocks(subjectRepository, releaseRepository);

                result.AssertNotFound();
            }
        }

        [Fact]
        public async Task Query_LatestRelease_SubjectNotFound()
        {
            var publicationId = Guid.NewGuid();

            var release = new Release
            {
                PublicationId = publicationId,
            };

            var query = new ObservationQueryContext
            {
                SubjectId = Guid.NewGuid(),
            };

            var contextId = Guid.NewGuid().ToString();

            await using var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId);
            var subjectRepository = new Mock<ISubjectRepository>(MockBehavior.Strict);

            subjectRepository
                .Setup(s => s.GetPublicationIdForSubject(query.SubjectId))
                .ReturnsAsync(publicationId);

            var releaseRepository = new Mock<IReleaseRepository>(MockBehavior.Strict);

            releaseRepository
                .Setup(s => s.GetLatestPublishedRelease(publicationId))
                .Returns(release);

            var service = BuildTableBuilderService(
                statisticsDbContext,
                subjectRepository: subjectRepository.Object,
                releaseRepository: releaseRepository.Object
            );

            var result = await service.Query(query);

            VerifyAllMocks(subjectRepository, releaseRepository);

            result.AssertNotFound();
        }

        [Fact]
        public async Task Query_LatestRelease_PredictedTableTooBig()
        {
            var publicationId = Guid.NewGuid();

            var release = new Release
            {
                PublicationId = publicationId
            };

            var releaseSubject = new ReleaseSubject
            {
                Release = release,
                Subject = new Subject
                {
                    Id = Guid.NewGuid()
                }
            };

            var filterItem1Id = Guid.NewGuid();
            var filterItem2Id = Guid.NewGuid();
            var indicator1Id = Guid.NewGuid();
            var indicator2Id = Guid.NewGuid();

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.Subject.Id,
                Filters = new [] {filterItem1Id, filterItem2Id},
                Indicators = new[] {indicator1Id, indicator2Id},
                Locations = new LocationQuery
                {
                    Country = new List<string>
                    {
                        "england"
                    }
                },
                TimePeriod = new TimePeriodQuery
                {
                    StartYear = 2019,
                    StartCode = TimeIdentifier.AcademicYear,
                    EndYear = 2020,
                    EndCode = TimeIdentifier.AcademicYear
                }
            };

            var contextId = Guid.NewGuid().ToString();

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                await statisticsDbContext.AddAsync(releaseSubject);
                await statisticsDbContext.SaveChangesAsync();
            }

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                var filterItemRepository = new Mock<IFilterItemRepository>(MockBehavior.Strict);

                filterItemRepository
                    .Setup(s => s.CountFilterItemsByFilter(
                        query.Filters))
                    .ReturnsAsync(new Dictionary<Guid, int>
                    {
                        {
                            // For the purpose of calculating the potential table size,
                            // treat all the Filter Items as belonging to the same Filter
                            Guid.NewGuid(), query.Filters.Count()
                        }
                    });

                var subjectRepository = new Mock<ISubjectRepository>(MockBehavior.Strict);

                subjectRepository
                    .Setup(s => s.GetPublicationIdForSubject(query.SubjectId))
                    .ReturnsAsync(publicationId);

                subjectRepository
                    .Setup(s => s.IsSubjectForLatestPublishedRelease(query.SubjectId))
                    .ReturnsAsync(true);

                var releaseRepository = new Mock<IReleaseRepository>(MockBehavior.Strict);

                releaseRepository
                    .Setup(s => s.GetLatestPublishedRelease(publicationId))
                    .Returns(release);

                var options = Options.Create(new TableBuilderOptions
                {
                    // 2 Filter items (from 1 Filter), 1 Location, and 2 Time periods provide 4 different combinations,
                    // assuming that all the data is provided. For 2 Indicators this would be 8 table cells rendered.
                    // Configure a maximum table size limit lower than 8.
                    MaxTableCellsAllowed = 7
                });

                var service = BuildTableBuilderService(
                    statisticsDbContext,
                    filterItemRepository: filterItemRepository.Object,
                    subjectRepository: subjectRepository.Object,
                    releaseRepository: releaseRepository.Object,
                    options: options
                );

                var result = await service.Query(query);

                VerifyAllMocks(filterItemRepository, subjectRepository, releaseRepository);

                result.AssertBadRequest(ValidationErrorMessages.QueryExceedsMaxAllowableTableSize);
            }
        }

        [Fact]
        public async Task Query_ReleaseId()
        {
            var releaseSubject = new ReleaseSubject
            {
                Release = new Release(),
                Subject = new Subject
                {
                    Id = Guid.NewGuid()
                },
            };

            var indicator1Id = Guid.NewGuid();
            var indicator2Id = Guid.NewGuid();

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.Subject.Id,
                Indicators = new[] { indicator1Id, indicator2Id, },
                Locations = new LocationQuery
                {
                    Country = new List<string>
                    {
                        "england"
                    }
                },
                TimePeriod = new TimePeriodQuery
                {
                    StartYear = 2019,
                    StartCode = TimeIdentifier.AcademicYear,
                    EndYear = 2020,
                    EndCode = TimeIdentifier.AcademicYear,
                }
            };

            var contextId = Guid.NewGuid().ToString();

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                await statisticsDbContext.AddAsync(releaseSubject);
                await statisticsDbContext.SaveChangesAsync();
            }

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                var observations = new List<Observation>
                {
                    new()
                    {
                        Measures = new Dictionary<Guid, string>
                        {
                            { indicator1Id, "123" },
                            { indicator2Id, "456" },
                        },
                        FilterItems = new List<ObservationFilterItem>(),
                        Year = 2019,
                        TimeIdentifier = TimeIdentifier.AcademicYear,
                    },
                    new()
                    {
                        Measures = new Dictionary<Guid, string>
                        {
                            { indicator1Id, "789" },
                            { Guid.NewGuid(), "1123" },
                            { Guid.NewGuid(), "1456" },
                        },
                        FilterItems = new List<ObservationFilterItem>(),
                        Year = 2020,
                        TimeIdentifier = TimeIdentifier.AcademicYear,
                    },
                };

                var subjectMeta = new ResultSubjectMetaViewModel
                {
                    Indicators = new List<IndicatorMetaViewModel>
                    {
                        new()
                        {
                            Label = "Test indicator"
                        }
                    },
                };

                var observationService = new Mock<IObservationService>(MockBehavior.Strict);

                observationService
                    .Setup(s => s.FindObservations(query, default))
                    .ReturnsAsync(observations);

                var resultSubjectMetaService = new Mock<IResultSubjectMetaService>(MockBehavior.Strict);

                resultSubjectMetaService
                    .Setup(
                        s => s.GetSubjectMeta(
                            releaseSubject.ReleaseId,
                            It.IsAny<SubjectMetaQueryContext>(),
                            It.IsAny<IList<Observation>>()
                        )
                    )
                    .ReturnsAsync(subjectMeta);

                var subjectRepository = new Mock<ISubjectRepository>(MockBehavior.Strict);
                subjectRepository.Setup(s =>
                        s.IsSubjectForLatestPublishedRelease(releaseSubject.Subject.Id))
                    .ReturnsAsync(false);

                var service = BuildTableBuilderService(
                    statisticsDbContext,
                    observationService: observationService.Object,
                    resultSubjectMetaService: resultSubjectMetaService.Object,
                    subjectRepository: subjectRepository.Object
                );

                var result = await service.Query(releaseSubject.ReleaseId, query);

                VerifyAllMocks(observationService, resultSubjectMetaService, subjectRepository);

                var observationResults = result.AssertRight().Results.ToList();

                Assert.Equal(2, observationResults.Count);

                Assert.Equal("2019_AY", observationResults[0].TimePeriod);
                Assert.Equal(2, observationResults[0].Measures.Count);
                Assert.Equal("123", observationResults[0].Measures[indicator1Id.ToString()]);
                Assert.Equal("456", observationResults[0].Measures[indicator2Id.ToString()]);

                Assert.Equal("2020_AY", observationResults[1].TimePeriod);
                Assert.Single(observationResults[1].Measures);
                Assert.Equal("789", observationResults[1].Measures[indicator1Id.ToString()]);

                Assert.Equal(subjectMeta, result.Right.SubjectMeta);
            }
        }

        [Fact]
        public async Task Query_ReleaseId_ReleaseNotFound()
        {
            var releaseSubject = new ReleaseSubject
            {
                Release = new Release(),
                Subject = new Subject(),
            };

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.Subject.Id,
            };

            var contextId = Guid.NewGuid().ToString();

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                await statisticsDbContext.AddAsync(releaseSubject);
                await statisticsDbContext.SaveChangesAsync();
            }

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                var service = BuildTableBuilderService(statisticsDbContext);

                var result = await service.Query(Guid.NewGuid(), query);

                result.AssertNotFound();
            }
        }

        [Fact]
        public async Task Query_ReleaseId_SubjectNotFound()
        {
            var releaseSubject = new ReleaseSubject
            {
                Release = new Release(),
                Subject = new Subject(),
            };

            var query = new ObservationQueryContext
            {
                SubjectId = Guid.NewGuid(),
            };

            var contextId = Guid.NewGuid().ToString();

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                await statisticsDbContext.AddAsync(releaseSubject);
                await statisticsDbContext.SaveChangesAsync();
            }

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                var service = BuildTableBuilderService(statisticsDbContext);

                var result = await service.Query(Guid.NewGuid(), query);

                result.AssertNotFound();
            }
        }

        [Fact]
        public async Task Query_ReleaseId_PredictedTableTooBig()
        {
            var releaseSubject = new ReleaseSubject
            {
                Release = new Release(),
                Subject = new Subject
                {
                    Id = Guid.NewGuid()
                },
            };

            var filterItem1Id = Guid.NewGuid();
            var filterItem2Id = Guid.NewGuid();
            var indicator1Id = Guid.NewGuid();
            var indicator2Id = Guid.NewGuid();

            var query = new ObservationQueryContext
            {
                SubjectId = releaseSubject.Subject.Id,
                Filters = new[] {filterItem1Id, filterItem2Id},
                Indicators = new[] {indicator1Id, indicator2Id},
                Locations = new LocationQuery
                {
                    Country = new List<string>
                    {
                        "england"
                    }
                },
                TimePeriod = new TimePeriodQuery
                {
                    StartYear = 2019,
                    StartCode = TimeIdentifier.AcademicYear,
                    EndYear = 2020,
                    EndCode = TimeIdentifier.AcademicYear
                }
            };

            var contextId = Guid.NewGuid().ToString();

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                await statisticsDbContext.AddAsync(releaseSubject);
                await statisticsDbContext.SaveChangesAsync();
            }

            await using (var statisticsDbContext = StatisticsDbUtils.InMemoryStatisticsDbContext(contextId))
            {
                var filterItemRepository = new Mock<IFilterItemRepository>(MockBehavior.Strict);

                filterItemRepository
                    .Setup(s => s.CountFilterItemsByFilter(
                        query.Filters))
                    .ReturnsAsync(new Dictionary<Guid, int>
                    {
                        {
                            // For the purpose of calculating the potential table size,
                            // treat all the Filter Items as belonging to the same Filter
                            Guid.NewGuid(), query.Filters.Count()
                        }
                    });

                var subjectRepository = new Mock<ISubjectRepository>(MockBehavior.Strict);
                subjectRepository.Setup(s =>
                        s.IsSubjectForLatestPublishedRelease(releaseSubject.Subject.Id))
                    .ReturnsAsync(false);

                var options = Options.Create(new TableBuilderOptions
                {
                    // 2 Filter items (from 1 Filter), 1 Location, and 2 Time periods provide 4 different combinations,
                    // assuming that all the data is provided. For 2 Indicators this would be 8 table cells rendered.
                    // Configure a maximum table size limit lower than 8.
                    MaxTableCellsAllowed = 7
                });

                var service = BuildTableBuilderService(
                    statisticsDbContext,
                    filterItemRepository: filterItemRepository.Object,
                    subjectRepository: subjectRepository.Object,
                    options: options
                );

                var result = await service.Query(releaseSubject.ReleaseId, query);

                VerifyAllMocks(filterItemRepository, subjectRepository);

                result.AssertBadRequest(ValidationErrorMessages.QueryExceedsMaxAllowableTableSize);
            }
        }

        private static IOptions<TableBuilderOptions> DefaultOptions()
        {
            return Options.Create(new TableBuilderOptions
            {
                MaxTableCellsAllowed = 25000
            });
        }

        private static TableBuilderService BuildTableBuilderService(
            StatisticsDbContext statisticsDbContext,
            IFilterItemRepository? filterItemRepository = null,
            IObservationService? observationService = null,
            IPersistenceHelper<StatisticsDbContext>? statisticsPersistenceHelper = null,
            IResultSubjectMetaService? resultSubjectMetaService = null,
            ISubjectRepository? subjectRepository = null,
            IUserService? userService = null,
            IResultBuilder<Observation, ObservationViewModel>? resultBuilder = null,
            IReleaseRepository? releaseRepository = null,
            IOptions<TableBuilderOptions>? options = null)
        {
            return new(
                filterItemRepository ?? Mock.Of<IFilterItemRepository>(MockBehavior.Strict),
                observationService ?? Mock.Of<IObservationService>(MockBehavior.Strict),
                statisticsPersistenceHelper ?? new PersistenceHelper<StatisticsDbContext>(statisticsDbContext),
                resultSubjectMetaService ?? Mock.Of<IResultSubjectMetaService>(MockBehavior.Strict),
                subjectRepository ?? Mock.Of<ISubjectRepository>(MockBehavior.Strict),
                userService ?? AlwaysTrueUserService().Object,
                resultBuilder ?? new ResultBuilder(DataServiceMapperUtils.DataServiceMapper()),
                releaseRepository ?? Mock.Of<IReleaseRepository>(MockBehavior.Strict),
                options ?? DefaultOptions()
            );
        }
    }
}
