using System;
using System.Diagnostics.CodeAnalysis;
using GovUk.Education.ExploreEducationStatistics.Common.Extensions;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GovUk.Education.ExploreEducationStatistics.Data.Model.Migrations;

[ExcludeFromCodeCoverage]
public partial class EES3945_CreateIndexedViews : Migration
{
    private const string MigrationId = "20230106181809";
    
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.SqlFromFile(MigrationConstants.MigrationsPath,
            $"{MigrationId}_View_ObservationSubjectIdGeographicLevel.sql");

        migrationBuilder.SqlFromFile(MigrationConstants.MigrationsPath,
            $"{MigrationId}_View_ObservationSubjectIdYearTimeIdentifier.sql");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("DROP VIEW dbo.ObservationSubjectIdGeographicLevel");
        migrationBuilder.Sql("DROP VIEW dbo.ObservationSubjectIdYearTimeIdentifier");
    }
}
