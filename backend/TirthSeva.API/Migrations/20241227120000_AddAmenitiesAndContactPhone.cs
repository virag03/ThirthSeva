using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TirthSeva.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAmenitiesAndContactPhone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Amenities",
                table: "Bhaktnivas",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                table: "Bhaktnivas",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amenities",
                table: "Bhaktnivas");

            migrationBuilder.DropColumn(
                name: "ContactPhone",
                table: "Bhaktnivas");
        }
    }
}