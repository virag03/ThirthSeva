using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TirthSeva.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCoordinatesToBhaktnivas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'Latitude' AND Object_ID = Object_ID(N'Bhaktnivas')) BEGIN ALTER TABLE [Bhaktnivas] ADD [Latitude] float NOT NULL DEFAULT 0.0 END");
            migrationBuilder.Sql("IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'Longitude' AND Object_ID = Object_ID(N'Bhaktnivas')) BEGIN ALTER TABLE [Bhaktnivas] ADD [Longitude] float NOT NULL DEFAULT 0.0 END");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /*
            migrationBuilder.DropColumn(
                name: "EmailOTP",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "OTPExpiry",
                table: "Users");
            */

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Bhaktnivas");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Bhaktnivas");
        }
    }
}
