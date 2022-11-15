using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GovUk.Education.ExploreEducationStatistics.Admin.Migrations.ContentMigrations
{
    public partial class EES3879AddEmbedBlock : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EmbedBlockId",
                table: "ContentBlock",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EmbedBlock",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmbedBlock", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContentBlock_EmbedBlockId",
                table: "ContentBlock",
                column: "EmbedBlockId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContentBlock_EmbedBlock_EmbedBlockId",
                table: "ContentBlock",
                column: "EmbedBlockId",
                principalTable: "EmbedBlock",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContentBlock_EmbedBlock_EmbedBlockId",
                table: "ContentBlock");

            migrationBuilder.DropTable(
                name: "EmbedBlock");

            migrationBuilder.DropIndex(
                name: "IX_ContentBlock_EmbedBlockId",
                table: "ContentBlock");

            migrationBuilder.DropColumn(
                name: "EmbedBlockId",
                table: "ContentBlock");
        }
    }
}
