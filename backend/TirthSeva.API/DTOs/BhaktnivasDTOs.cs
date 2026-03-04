using System.ComponentModel.DataAnnotations;

namespace TirthSeva.API.DTOs
{
    public class BhaktnivasListDTO
    {
        public int Id { get; set; }
        public int TempleId { get; set; }
        public string TempleName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public int Capacity { get; set; }
        public bool IsAvailable { get; set; }
        public string DistanceFromTemple { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string ServiceProviderName { get; set; } = string.Empty;
    }

    public class BhaktnivasDetailDTO : BhaktnivasListDTO
    {
        public string Description { get; set; } = string.Empty;
        public int ServiceProviderId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateBhaktnivasRequest
    {
        [Required]
        public int TempleId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(10, 200)]
        public decimal PricePerNight { get; set; }

        [Required]
        [Range(1, 100)]
        public int Capacity { get; set; }

        [StringLength(50)]
        public string DistanceFromTemple { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string Amenities { get; set; } = string.Empty;

        public string ContactPhone { get; set; } = string.Empty;
    }

    public class UpdateBhaktnivasRequest : CreateBhaktnivasRequest
    {
        public bool IsAvailable { get; set; }
    }

    public class BhaktnivasSlotDTO
    {
        public int Id { get; set; }
        public int BhaktnivasId { get; set; }
        public DateTime Date { get; set; }
        public int TotalCapacity { get; set; }
        public int AvailableCapacity { get; set; }
    }

    public class ReleaseBhaktnivasSlotsRequest
    {
        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [Range(1, 1000)]
        public int Capacity { get; set; }
    }
}
