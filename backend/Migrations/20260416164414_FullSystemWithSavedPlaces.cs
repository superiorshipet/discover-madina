using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DiscoverMadina.Migrations
{
    /// <inheritdoc />
    public partial class FullSystemWithSavedPlaces : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Attractions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    NameEn = table.Column<string>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    Icon = table.Column<string>(type: "TEXT", nullable: false),
                    Latitude = table.Column<decimal>(type: "TEXT", precision: 10, scale: 7, nullable: false),
                    Longitude = table.Column<decimal>(type: "TEXT", precision: 10, scale: 7, nullable: false),
                    RatingAvg = table.Column<float>(type: "REAL", nullable: false),
                    OpeningHours = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    IsFeatured = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attractions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    PreferredLanguage = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

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

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false),
                    Comment = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    AttractionId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Attractions_AttractionId",
                        column: x => x.AttractionId,
                        principalTable: "Attractions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SavedPlaces",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    AttractionId = table.Column<int>(type: "INTEGER", nullable: false),
                    SavedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedPlaces", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedPlaces_Attractions_AttractionId",
                        column: x => x.AttractionId,
                        principalTable: "Attractions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedPlaces_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Attractions",
                columns: new[] { "Id", "Category", "CreatedAt", "Description", "Icon", "ImageUrl", "IsFeatured", "Latitude", "Longitude", "Name", "NameEn", "OpeningHours", "RatingAvg" },
                values: new object[,]
                {
                    { 1, "religious", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "المسجد النبوي الشريف هو ثاني أقدس مكان في الإسلام.", "🕌", null, true, 24.4672m, 39.6111m, "المسجد النبوي الشريف", "Al-Masjid an-Nabawi", "24/7", 5f },
                    { 2, "religious", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "أول مسجد بُني في الإسلام.", "🕌", null, true, 24.4397m, 39.6151m, "مسجد قباء", "Masjid Quba", "24/7", 4.9f },
                    { 3, "cultural", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "موقع جبل أحد التاريخي.", "⛰️", null, true, 24.5267m, 39.6411m, "جبل أحد", "Mount Uhud", "دائماً مفتوح", 4.8f },
                    { 4, "religious", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "هنا تلقى النبي ﷺ الوحي بتغيير القبلة.", "🕌", null, true, 24.4847m, 39.5789m, "مسجد القبلتين", "Masjid Al-Qiblatayn", "24/7", 4.7f },
                    { 5, "dining", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "سلسلة مطاعم سعودية شهيرة.", "🍗", null, false, 24.4680m, 39.6090m, "مطعم البيك", "Al-Baik", "11:00 - 02:00", 4.7f },
                    { 6, "cultural", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "متحف يعرض تاريخ وتراث المدينة.", "🏛️", null, false, 24.4710m, 39.6125m, "متحف دار المدينة", "Dar Al Madinah Museum", "09:00 - 21:00", 4.6f },
                    { 7, "religious", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "مجمع مساجد تاريخية.", "🕌", null, false, 24.5019m, 39.6078m, "المساجد السبعة", "The Seven Mosques", "24/7", 4.5f },
                    { 8, "entertainment", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "أكبر حديقة عامة في المدينة.", "🌳", null, false, 24.4800m, 39.5960m, "حديقة الملك فهد", "King Fahd Park", "07:00 - 23:00", 4.4f }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AttractionPhotos_AttractionId",
                table: "AttractionPhotos",
                column: "AttractionId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_AttractionId",
                table: "Reviews",
                column: "AttractionId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedPlaces_AttractionId",
                table: "SavedPlaces",
                column: "AttractionId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedPlaces_UserId",
                table: "SavedPlaces",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "AttractionPhotos");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "SavedPlaces");

            migrationBuilder.DropTable(
                name: "Attractions");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
