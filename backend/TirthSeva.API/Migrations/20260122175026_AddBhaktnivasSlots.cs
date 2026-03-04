using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TirthSeva.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBhaktnivasSlots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BhaktnivasSlots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BhaktnivasId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalCapacity = table.Column<int>(type: "int", nullable: false),
                    AvailableCapacity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BhaktnivasSlots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BhaktnivasSlots_Bhaktnivas_BhaktnivasId",
                        column: x => x.BhaktnivasId,
                        principalTable: "Bhaktnivas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BhaktnivasSlots_BhaktnivasId",
                table: "BhaktnivasSlots",
                column: "BhaktnivasId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BhaktnivasSlots");
        }
    }
}
