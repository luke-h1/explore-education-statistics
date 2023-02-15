using System;
using System.Threading.Tasks;
using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Data.Model;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Database;
using Xunit;
using static GovUk.Education.ExploreEducationStatistics.Content.Model.Tests.Utils.ContentDbUtils;
using static GovUk.Education.ExploreEducationStatistics.Data.Model.Tests.Utils.StatisticsDbUtils;
using ContentRelease = GovUk.Education.ExploreEducationStatistics.Content.Model.Release;

namespace GovUk.Education.ExploreEducationStatistics.Data.Services.Tests;

public class ReleaseSubjectServiceTests
{
    [Fact]
    public async Task GetReleaseSubjectForLatestPublishedVersion()
    {
        var subject = new Subject();

        var previousReleaseVersion = new ContentRelease
        {
            Id = Guid.NewGuid(),
            Published = DateTime.UtcNow.AddDays(-2),
            Version = 0
        };

        var latestReleaseVersion = new ContentRelease
        {
            Id = Guid.NewGuid(),
            Published = DateTime.UtcNow.AddDays(-1),
            Version = 1
        };

        var futureReleaseVersion = new ContentRelease
        {
            Id = Guid.NewGuid(),
            Published = DateTime.UtcNow.AddDays(1),
            Version = 2
        };

        var releaseSubjectPreviousRelease = new ReleaseSubject
        {
            Subject = subject,
            Release = new Release
            {
                Id = previousReleaseVersion.Id,
            }
        };

        var releaseSubjectLatestRelease = new ReleaseSubject
        {
            Subject = subject,
            Release = new Release
            {
                Id = latestReleaseVersion.Id
            }
        };

        // Link the Subject to the next version of the Release with a future Published date/time
        // that should not be considered Live
        var releaseSubjectFutureRelease = new ReleaseSubject
        {
            Subject = subject,
            Release = new Release
            {
                Id = futureReleaseVersion.Id
            }
        };

        var statisticsDbContextId = Guid.NewGuid().ToString();
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(statisticsDbContextId))
        {
            await statisticsDbContext.Subject.AddAsync(subject);
            await statisticsDbContext.ReleaseSubject.AddRangeAsync(
                releaseSubjectLatestRelease,
                releaseSubjectFutureRelease,
                releaseSubjectPreviousRelease);
            await statisticsDbContext.SaveChangesAsync();
        }

        var contentDbContextId = Guid.NewGuid().ToString();
        await using (var contentDbContext = InMemoryContentDbContext(contentDbContextId))
        {
            await contentDbContext.Releases.AddRangeAsync(
                latestReleaseVersion,
                futureReleaseVersion,
                previousReleaseVersion);

            await contentDbContext.SaveChangesAsync();
        }

        await using (var statisticsDbContext = InMemoryStatisticsDbContext(statisticsDbContextId))
        await using (var contentDbContext = InMemoryContentDbContext(contentDbContextId))
        {
            var service = BuildService(statisticsDbContext, contentDbContext);

            var result = await service.GetReleaseSubjectForLatestPublishedVersion(subject.Id);

            Assert.NotNull(result);
            Assert.Equal(releaseSubjectLatestRelease.ReleaseId, result!.ReleaseId);
            Assert.Equal(releaseSubjectLatestRelease.SubjectId, result.SubjectId);
        }
    }

    [Fact]
    public async Task GetReleaseSubjectForLatestPublishedVersion_NoReleases()
    {
        var subject = new Subject();

        var statisticsDbContextId = Guid.NewGuid().ToString();
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(statisticsDbContextId))
        {
            await statisticsDbContext.Subject.AddAsync(subject);
            await statisticsDbContext.SaveChangesAsync();
        }

        var contentDbContextId = Guid.NewGuid().ToString();
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(statisticsDbContextId))
        await using (var contentDbContext = InMemoryContentDbContext(contentDbContextId))
        {
            var service = BuildService(statisticsDbContext, contentDbContext);
            Assert.Null(await service.GetReleaseSubjectForLatestPublishedVersion(subject.Id));
        }
    }

    [Fact]
    public async Task GetReleaseSubjectForLatestPublishedVersion_NoPublishedReleases()
    {
        var futureReleaseVersion = new ContentRelease
        {
            Id = Guid.NewGuid(),
            Published = DateTime.UtcNow.AddDays(1)
        };

        // Link the Subject to a Release with a future Published date/time that should not be considered Live
        var releaseSubjectFutureRelease = new ReleaseSubject
        {
            Subject = new Subject(),
            Release = new Release
            {
                Id = futureReleaseVersion.Id
            }
        };

        var statisticsDbContextId = Guid.NewGuid().ToString();
        await using (var statisticsDbContext = InMemoryStatisticsDbContext(statisticsDbContextId))
        {
            await statisticsDbContext.ReleaseSubject.AddAsync(releaseSubjectFutureRelease);
            await statisticsDbContext.SaveChangesAsync();
        }

        var contentDbContextId = Guid.NewGuid().ToString();
        await using (var contentDbContext = InMemoryContentDbContext(contentDbContextId))
        {
            await contentDbContext.Releases.AddRangeAsync(futureReleaseVersion);
            await contentDbContext.SaveChangesAsync();
        }

        await using (var statisticsDbContext = InMemoryStatisticsDbContext(statisticsDbContextId))
        await using (var contentDbContext = InMemoryContentDbContext(contentDbContextId))
        {
            var service = BuildService(statisticsDbContext, contentDbContext);
            Assert.Null(
                await service.GetReleaseSubjectForLatestPublishedVersion(releaseSubjectFutureRelease.SubjectId));
        }
    }

    private static ReleaseSubjectService BuildService(StatisticsDbContext statisticsDbContext, ContentDbContext contentDbContext)
    {
        return new ReleaseSubjectService(
            statisticsDbContext: statisticsDbContext,
            contentDbContext: contentDbContext
        );
    }
}
