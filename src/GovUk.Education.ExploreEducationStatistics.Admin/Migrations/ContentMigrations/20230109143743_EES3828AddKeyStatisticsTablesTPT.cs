using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GovUk.Education.ExploreEducationStatistics.Admin.Migrations.ContentMigrations
{
    public partial class EES3828AddKeyStatisticsTablesTPT : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KeyStatistics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReleaseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Trend = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GuidanceTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GuidanceText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Order = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Updated = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeyStatistics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KeyStatistics_Releases_ReleaseId",
                        column: x => x.ReleaseId,
                        principalTable: "Releases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KeyStatisticsDataBlock",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DataBlockId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeyStatisticsDataBlock", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KeyStatisticsDataBlock_ContentBlock_DataBlockId",
                        column: x => x.DataBlockId,
                        principalTable: "ContentBlock",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KeyStatisticsDataBlock_KeyStatistics_Id",
                        column: x => x.Id,
                        principalTable: "KeyStatistics",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "KeyStatisticsText",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Statistic = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeyStatisticsText", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KeyStatisticsText_KeyStatistics_Id",
                        column: x => x.Id,
                        principalTable: "KeyStatistics",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_KeyStatistics_ReleaseId",
                table: "KeyStatistics",
                column: "ReleaseId");

            migrationBuilder.CreateIndex(
                name: "IX_KeyStatisticsDataBlock_DataBlockId",
                table: "KeyStatisticsDataBlock",
                column: "DataBlockId");

            migrationBuilder.Sql("GRANT SELECT ON dbo.KeyStatistics TO [publisher];");
            migrationBuilder.Sql("GRANT SELECT ON dbo.KeyStatisticsText TO [publisher];");
            migrationBuilder.Sql("GRANT SELECT ON dbo.KeyStatisticDataBlock TO [publisher];");
            migrationBuilder.Sql("GRANT SELECT ON dbo.KeyStatistics TO [content];");
            migrationBuilder.Sql("GRANT SELECT ON dbo.KeyStatisticsText TO [content];");
            migrationBuilder.Sql("GRANT SELECT ON dbo.KeyStatisticDataBlock TO [content];");

            migrationBuilder.Sql("INSERT INTO KeyStatistics (Id, ReleaseId, Trend, GuidanceTitle, GuidanceText, [Order], Created, Updated) " +
                                 "SELECT NEWID() AS Id, RCS.ReleaseId AS ReleaseId, JSON_VALUE(DataBlock_Summary, '$.DataSummary[0]') AS Trend, JSON_VALUE(DataBlock_Summary, '$.DataDefinitionTitle[0]') AS GuidanceTitle, JSON_VALUE(DataBlock_Summary, '$.DataDefinition[0]') AS GuidanceText, CB.[Order], GETDATE() AS Created, NULL AS Updated " +
                                 "FROM ContentBlock CB " +
                                 "JOIN ContentSections CS ON CS.Id = CB.ContentSectionId " +
                                 "JOIN ReleaseContentSections RCS ON CS.Id = RCS.ContentSectionId " +
                                 "WHERE CS.Type = 'KeyStatistics';");

            migrationBuilder.Sql("INSERT INTO KeyStatisticDataBlock (Id, DataBlockId) " +
                                 "SELECT KS.Id AS Id, CB.Id AS DataBlockId " +
                                 "FROM KeyStatistics KS " +
                                 "JOIN ReleaseContentSections RCS ON RCS.ReleaseId = KS.ReleaseId " +
                                 "JOIN ContentSections CS ON CS.Id = RCS.ContentSectionId " +
                                 "JOIN ContentBlock CB ON (CS.Id = CB.ContentSectionId " +
                                 "AND JSON_VALUE(CB.DataBlock_Summary, '$.DataSummary[0]') = KS.Trend " +
                                 "AND JSON_VALUE(CB.DataBlock_Summary, '$.DataDefinitionTitle[0]') = KS.GuidanceTitle " +
                                 "AND JSON_VALUE(CB.DataBlock_Summary, '$.DataDefinition[0]') = KS.GuidanceText " +
                                 "AND CB.[Order] = KS.[Order]) " +
                                 "WHERE CS.Type = 'KeyStatistics';");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KeyStatisticsDataBlock");

            migrationBuilder.DropTable(
                name: "KeyStatisticsText");

            migrationBuilder.DropTable(
                name: "KeyStatistics");
        }
    }
}
