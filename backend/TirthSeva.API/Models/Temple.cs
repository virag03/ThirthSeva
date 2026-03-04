using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TirthSeva.API.Models
{
    public class Temple
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("ServiceProvider")]
        public int ServiceProviderId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string State { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ImagePath { get; set; }

        public double Latitude { get; set; } = 0;
        public double Longitude { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User ServiceProvider { get; set; } = null!;
        public virtual ICollection<Bhaktnivas> BhaktnivasList { get; set; } = new List<Bhaktnivas>();
        public virtual ICollection<DarshanSlot> DarshanSlots { get; set; } = new List<DarshanSlot>();

        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
