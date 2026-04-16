using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DiscoverMadina.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
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

            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "PasswordHash", "Role", "Username" },
                values: new object[] { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "$$2a$11$yQ0Z1X2c3V4b5N6m8K9J0eW1R2T3Y4U5I6O7P8A9S0D1F2G3H4J5K6L7", "admin", "admin" });

            migrationBuilder.InsertData(
                table: "Attractions",
                columns: new[] { "Id", "Category", "CreatedAt", "Description", "Icon", "ImageUrl", "IsFeatured", "Latitude", "Longitude", "Name", "NameEn", "OpeningHours", "RatingAvg" },
                values: new object[,]
                {
                    { 1, "religious", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "المسجد النبوي الشريف هو ثاني أقدس مكان في الإسلام.", "🕌", null, true, 24.4672m, 39.6111m, "المسجد النبوي الشريف", "Al-Masjid an-Nabawi", "24/7", 5f },
                    { 2, "religious", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "أول مسجد بُني في الإسلام.", "🕌", null, true, 24.4397m, 39.6151m, "مسجد قباء", "Masjid Quba", "24/7", 4.9f },
                    { 3, "cultural", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "يعرض تاريخ المدينة المنورة عبر العصور.", "🏛️", null, true, 24.4710m, 39.6125m, "متحف المدينة المنورة", "Madinah Museum", "09:00 - 21:00", 4.6f },
                    { 4, "entertainment", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "أكبر حديقة عامة في المدينة المنورة.", "🌳", null, true, 24.4800m, 39.5960m, "حديقة الملك فهد", "King Fahd Park", "07:00 - 23:00", 4.4f },
                    { 5, "dining", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "سلسلة مطاعم سعودية شهيرة.", "🍗", null, false, 24.4680m, 39.6090m, "مطعم البيك", "Al-Baik Restaurant", "10:00 - 02:00", 4.7f }
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
                name: "Attractions");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
