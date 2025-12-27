using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TirthSeva.API.Models
{
    public class FoodService
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Temple")]
        public int TempleId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // Food, Prasadam, Shop

        [StringLength(100)]
        public string Timing { get; set; } = string.Empty; // e.g., "6:00 AM - 9:00 PM"

        [StringLength(50)]
        public string Distance { get; set; } = string.Empty; // e.g., "200m", "500m"

        [Range(10, 500)]
        public decimal AveragePrice { get; set; }

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Temple Temple { get; set; } = null!;
    }
}
