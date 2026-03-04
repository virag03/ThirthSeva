using Microsoft.EntityFrameworkCore;
using TirthSeva.API.Models;

namespace TirthSeva.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Temple> Temples { get; set; }
        public DbSet<Bhaktnivas> Bhaktnivas { get; set; }
        public DbSet<DarshanSlot> DarshanSlots { get; set; }
        public DbSet<BhaktnivasSlot> BhaktnivasSlots { get; set; }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure decimal precision for MySQL
            modelBuilder.Entity<Bhaktnivas>()
                .Property(b => b.PricePerNight)
                .HasPrecision(10, 2);



            modelBuilder.Entity<Booking>()
                .Property(b => b.TotalAmount)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(10, 2);

            // Configure relationships
            modelBuilder.Entity<Bhaktnivas>()
                .HasOne(b => b.Temple)
                .WithMany(t => t.BhaktnivasList)
                .HasForeignKey(b => b.TempleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Bhaktnivas>()
                .HasOne(b => b.ServiceProvider)
                .WithMany(u => u.BhaktnivasListings)
                .HasForeignKey(b => b.ServiceProviderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Bhaktnivas)
                .WithMany(bh => bh.Bookings)
                .HasForeignKey(b => b.BhaktnivasId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.DarshanSlot)
                .WithMany(d => d.Bookings)
                .HasForeignKey(b => b.DarshanSlotId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Booking)
                .WithOne(b => b.Payment)
                .HasForeignKey<Payment>(p => p.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Create indexes for better performance
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Temple>()
                .HasIndex(t => t.City);

            modelBuilder.Entity<Temple>()
                .HasIndex(t => t.State);

            modelBuilder.Entity<Bhaktnivas>()
                .HasIndex(b => b.TempleId);

            modelBuilder.Entity<Booking>()
                .HasIndex(b => b.UserId);

            modelBuilder.Entity<Booking>()
                .HasIndex(b => b.BookingDate);
        }
    }
}
