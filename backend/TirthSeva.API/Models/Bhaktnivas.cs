using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TirthSeva.API.Models
{
    public class Bhaktnivas
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Temple")]
        public int TempleId { get; set; }

        [Required]
        [ForeignKey("ServiceProvider")]
        public int ServiceProviderId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(50, 200)]
        public decimal PricePerNight { get; set; }

        [Required]
        [Range(1, 100)]
        public int Capacity { get; set; }

        public bool IsAvailable { get; set; } = true;

        [StringLength(50)]
        public string DistanceFromTemple { get; set; } = string.Empty; // e.g., "500m", "1km"

        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(500)]
        public string Amenities { get; set; } = string.Empty;

        [StringLength(20)]
        public string ContactPhone { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Temple Temple { get; set; } = null!;
        public virtual User ServiceProvider { get; set; } = null!;
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
