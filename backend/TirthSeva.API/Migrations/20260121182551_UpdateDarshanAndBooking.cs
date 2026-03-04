using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TirthSeva.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDarshanAndBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "DarshanSlots",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfPersons",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "DarshanSlots");

            migrationBuilder.DropColumn(
                name: "NumberOfPersons",
                table: "Bookings");
        }
    }
}
