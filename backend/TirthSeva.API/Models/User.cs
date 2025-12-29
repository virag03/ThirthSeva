using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TirthSeva.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = "User"; // User, ServiceProvider, Admin

        public bool IsEmailVerified { get; set; } = false;

        public string? EmailVerificationToken { get; set; }

        public string? EmailOTP { get; set; }

        public DateTime? OTPExpiry { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public virtual ICollection<Bhaktnivas> BhaktnivasListings { get; set; } = new List<Bhaktnivas>();
    }
}
