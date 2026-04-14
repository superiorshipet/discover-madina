using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DiscoverMadina.Migrations
{
    /// <inheritdoc />
    public partial class AddAttractionPhotosTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AttractionPhotos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AttractionId = table.Column<int>(type: "INTEGER", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    IsPrimary = table.Column<bool>(type: "INTEGER", nullable: false),
                    DisplayOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttractionPhotos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AttractionPhotos_Attractions_AttractionId",
                        column: x => x.AttractionId,
                        principalTable: "Attractions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$PX3ITuqB95TE.dNFJ8gU2.riyGgJgS7GHk/K1w9GQapHdK0rpJ77G");

            migrationBuilder.CreateIndex(
                name: "IX_AttractionPhotos_AttractionId",
                table: "AttractionPhotos",
                column: "AttractionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AttractionPhotos");

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$9W89d59VX91xuRGH/r31XuwCE6yN4BRN2iNhl57Q469w.My0f2p.m");
        }
    }
}
