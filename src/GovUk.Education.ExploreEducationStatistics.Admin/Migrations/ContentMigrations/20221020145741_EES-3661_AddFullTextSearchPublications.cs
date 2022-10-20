using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GovUk.Education.ExploreEducationStatistics.Admin.Migrations.ContentMigrations;

[ExcludeFromCodeCoverage]
public partial class EES3661_AddFullTextSearchPublications : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(suppressTransaction: true, sql: "CREATE FULLTEXT CATALOG PublicationFullTextCatalog");
        migrationBuilder.Sql(suppressTransaction: true, sql: @"
CREATE FULLTEXT INDEX ON dbo.Publications
(
  Summary            -- Column 1
      Language 2057, -- UK English LCID
  Title              -- Column 2
      Language 2057  -- UK English LCID
)
KEY INDEX PK_Publications ON PublicationFullTextCatalog --Unique index
WITH CHANGE_TRACKING AUTO; --Population type");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(suppressTransaction: true, sql: "DROP FULLTEXT INDEX ON dbo.Publications");
        migrationBuilder.Sql(suppressTransaction: true, sql: "DROP FULLTEXT CATALOG PublicationFullTextCatalog");
    }
}
