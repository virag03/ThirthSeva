using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TirthSeva.API.Models
{
    public class BhaktnivasSlot
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Bhaktnivas")]
        public int BhaktnivasId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [Range(1, 1000)]
        public int TotalCapacity { get; set; }

        [Required]
        public int AvailableCapacity { get; set; }

        // Navigation property
        public virtual Bhaktnivas Bhaktnivas { get; set; } = null!;
    }
}
