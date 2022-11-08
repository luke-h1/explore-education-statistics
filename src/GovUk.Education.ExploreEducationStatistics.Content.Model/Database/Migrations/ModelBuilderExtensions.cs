#nullable enable
using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace GovUk.Education.ExploreEducationStatistics.Content.Model.Database.Migrations;

public static class ModelBuilderExtensions
{
    private static readonly MethodInfo? PublicationsFreeTextTableMethodInfo = typeof(ContentDbContext)
        .GetMethod(nameof(ContentDbContext.PublicationsFreeTextTable),
            new[] { typeof(string) });

    public static ModelBuilder AddFreeTextTableSupport(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FreeTextRank>().HasNoKey().ToTable((string?) null);

        // Map PublicationsFreeTextTable queryable function to database table value function (TVF)
        // TODO null check?
        modelBuilder.HasDbFunction(PublicationsFreeTextTableMethodInfo!);

        return modelBuilder;
    }
}
