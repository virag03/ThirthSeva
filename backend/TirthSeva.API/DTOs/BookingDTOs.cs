using System.ComponentModel.DataAnnotations;

namespace TirthSeva.API.DTOs
{
    public class BookingListDTO
    {
        public int Id { get; set; }
        public string TempleName { get; set; } = string.Empty;
        public string? BhaktnivasName { get; set; }
        public DateTime? DarshanDate { get; set; }
        public string? DarshanTime { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string BookingStatus { get; set; } = string.Empty;
    }

    public class BookingDetailDTO : BookingListDTO
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public int TempleId { get; set; }
        public int? BhaktnivasId { get; set; }
        public int? DarshanSlotId { get; set; }
        public string? SpecialRequests { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateBookingRequest
    {
        [Required]
        public int TempleId { get; set; }

        public int? BhaktnivasId { get; set; }

        public int? DarshanSlotId { get; set; }

        public DateTime? CheckInDate { get; set; }

        public DateTime? CheckOutDate { get; set; }

        [Required]
        [Range(0, 100000)]
        public decimal TotalAmount { get; set; }

        public string? SpecialRequests { get; set; }
    }
}
