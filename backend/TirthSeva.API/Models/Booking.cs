using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TirthSeva.API.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        [ForeignKey("Temple")]
        public int TempleId { get; set; }

        [ForeignKey("Bhaktnivas")]
        public int? BhaktnivasId { get; set; }

        [ForeignKey("DarshanSlot")]
        public int? DarshanSlotId { get; set; }

        [Required]
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;

        public DateTime? CheckInDate { get; set; }

        public DateTime? CheckOutDate { get; set; }

        [Required]
        [Range(0, 100000)]
        public decimal TotalAmount { get; set; }

        [Required]
        [StringLength(20)]
        public string PaymentStatus { get; set; } = "Pending"; // Pending, Completed, Failed, Refunded

        [Required]
        [StringLength(20)]
        public string BookingStatus { get; set; } = "Confirmed"; // Confirmed, Cancelled, Completed

        [StringLength(500)]
        public string? SpecialRequests { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Temple Temple { get; set; } = null!;
        public virtual Bhaktnivas? Bhaktnivas { get; set; }
        public virtual DarshanSlot? DarshanSlot { get; set; }
        public virtual Payment? Payment { get; set; }
    }
}
