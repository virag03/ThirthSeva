using System.ComponentModel.DataAnnotations;

namespace TirthSeva.API.DTOs
{
    public class DarshanSlotCreateRequest
    {
        [Required]
        public int TempleId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string StartTime { get; set; } = string.Empty; // Using string to ensure easy TimeSpan parsing

        [Required]
        public string EndTime { get; set; } = string.Empty;

        [Required]
        [Range(1, 1000)]
        public int Capacity { get; set; }

        [Required]
        [Range(0, 10000)]
        public decimal Price { get; set; }
    }

    public class DarshanSlotDTO
    {
        public int Id { get; set; }
        public int TempleId { get; set; }
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int AvailableSlots { get; set; }
        public decimal Price { get; set; }
    }
}
