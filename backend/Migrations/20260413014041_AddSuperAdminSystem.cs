using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DiscoverMadina.Migrations
{
    /// <inheritdoc />
    public partial class AddSuperAdminSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "Username" },
                values: new object[] { "$2a$11$9W89d59VX91xuRGH/r31XuwCE6yN4BRN2iNhl57Q469w.My0f2p.m", "superior" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "Username" },
                values: new object[] { "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", "admin01" });
        }
    }
}
