using GovUk.Education.ExploreEducationStatistics.Content.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Data.Model.Database;
using GovUk.Education.ExploreEducationStatistics.Data.Processor.Services.Interfaces;
using GovUk.Education.ExploreEducationStatistics.Data.Processor.Utils;
using Microsoft.EntityFrameworkCore;
using DbUtils = GovUk.Education.ExploreEducationStatistics.Data.Processor.Utils.DbUtils;

namespace GovUk.Education.ExploreEducationStatistics.Data.Processor.Services;

public class DbContextSupplier : IDbContextSupplier
{
    /// <summary>
    /// DbContextOptions that are unique per Function job. It is therefore a transient dependency in CI, and
    /// thus this component must also be a transient DI dependency for other services to use.
    /// </summary>
    private readonly DbContextOptions<ContentDbContext> _contentDbContextOptions;

    public DbContextSupplier(DbContextOptions<ContentDbContext> contentDbContextOptions)
    {
        _contentDbContextOptions = contentDbContextOptions;
    }

    public ContentDbContext CreateContentDbContext()
    {
        return new ContentDbContext(_contentDbContextOptions);
    }

    public StatisticsDbContext CreateStatisticsDbContext()
    {
        return DbUtils.CreateStatisticsDbContext();
    }
}