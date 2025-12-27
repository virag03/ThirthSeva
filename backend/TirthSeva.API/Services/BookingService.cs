using Microsoft.EntityFrameworkCore;
using TirthSeva.API.Data;
using TirthSeva.API.DTOs;
using TirthSeva.API.Models;

namespace TirthSeva.API.Services
{
    public class BookingService
    {
        private readonly ApplicationDbContext _context;

        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Booking?> CreateBookingAsync(CreateBookingRequest request, int userId)
        {
            // Validate booking
            if (!request.BhaktnivasId.HasValue && !request.DarshanSlotId.HasValue)
            {
                return null; // Must book either Bhaktnivas or Darshan
            }

            // Check Darshan slot availability if booking Darshan
            if (request.DarshanSlotId.HasValue)
            {
                var darshanSlot = await _context.DarshanSlots.FindAsync(request.DarshanSlotId.Value);
                if (darshanSlot == null || darshanSlot.AvailableSlots <= 0)
                {
                    return null; // Slot not available
                }

                // Decrement available slots
                darshanSlot.AvailableSlots--;
            }

            var booking = new Booking
            {
                UserId = userId,
                TempleId = request.TempleId,
                BhaktnivasId = request.BhaktnivasId,
                DarshanSlotId = request.DarshanSlotId,
                BookingDate = DateTime.UtcNow,
                CheckInDate = request.CheckInDate,
                CheckOutDate = request.CheckOutDate,
                TotalAmount = request.TotalAmount,
                PaymentStatus = "Pending",
                BookingStatus = "Confirmed",
                SpecialRequests = request.SpecialRequests,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return booking;
        }

        public async Task<List<BookingListDTO>> GetUserBookingsAsync(int userId)
        {
            return await _context.Bookings
                .Include(b => b.Temple)
                .Include(b => b.Bhaktnivas)
                .Include(b => b.DarshanSlot)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookingListDTO
                {
                    Id = b.Id,
                    TempleName = b.Temple.Name,
                    BhaktnivasName = b.Bhaktnivas != null ? b.Bhaktnivas.Name : null,
                    DarshanDate = b.DarshanSlot != null ? b.DarshanSlot.Date : null,
                    DarshanTime = b.DarshanSlot != null ? 
                        $"{b.DarshanSlot.StartTime:hh\\:mm} - {b.DarshanSlot.EndTime:hh\\:mm}" : null,
                    BookingDate = b.BookingDate,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    TotalAmount = b.TotalAmount,
                    PaymentStatus = b.PaymentStatus,
                    BookingStatus = b.BookingStatus
                })
                .ToListAsync();
        }

        public async Task<List<BookingListDTO>> GetProviderBookingsAsync(int providerId)
        {
            return await _context.Bookings
                .Include(b => b.Temple)
                .Include(b => b.Bhaktnivas)
                    .ThenInclude(bh => bh!.ServiceProvider)
                .Include(b => b.DarshanSlot)
                .Where(b => b.Bhaktnivas != null && b.Bhaktnivas.ServiceProviderId == providerId)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookingListDTO
                {
                    Id = b.Id,
                    TempleName = b.Temple.Name,
                    BhaktnivasName = b.Bhaktnivas != null ? b.Bhaktnivas.Name : null,
                    DarshanDate = b.DarshanSlot != null ? b.DarshanSlot.Date : null,
                    DarshanTime = b.DarshanSlot != null ? 
                        $"{b.DarshanSlot.StartTime:hh\\:mm} - {b.DarshanSlot.EndTime:hh\\:mm}" : null,
                    BookingDate = b.BookingDate,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    TotalAmount = b.TotalAmount,
                    PaymentStatus = b.PaymentStatus,
                    BookingStatus = b.BookingStatus
                })
                .ToListAsync();
        }

        public async Task<List<BookingDetailDTO>> GetAllBookingsAsync()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Temple)
                .Include(b => b.Bhaktnivas)
                .Include(b => b.DarshanSlot)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookingDetailDTO
                {
                    Id = b.Id,
                    UserId = b.UserId,
                    UserName = b.User.Name,
                    UserEmail = b.User.Email,
                    TempleId = b.TempleId,
                    TempleName = b.Temple.Name,
                    BhaktnivasId = b.BhaktnivasId,
                    BhaktnivasName = b.Bhaktnivas != null ? b.Bhaktnivas.Name : null,
                    DarshanSlotId = b.DarshanSlotId,
                    DarshanDate = b.DarshanSlot != null ? b.DarshanSlot.Date : null,
                    DarshanTime = b.DarshanSlot != null ? 
                        $"{b.DarshanSlot.StartTime:hh\\:mm} - {b.DarshanSlot.EndTime:hh\\:mm}" : null,
                    BookingDate = b.BookingDate,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    TotalAmount = b.TotalAmount,
                    PaymentStatus = b.PaymentStatus,
                    BookingStatus = b.BookingStatus,
                    SpecialRequests = b.SpecialRequests,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<BookingDetailDTO?> GetBookingByIdAsync(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Temple)
                .Include(b => b.Bhaktnivas)
                .Include(b => b.DarshanSlot)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
            {
                return null;
            }

            return new BookingDetailDTO
            {
                Id = booking.Id,
                UserId = booking.UserId,
                UserName = booking.User.Name,
                UserEmail = booking.User.Email,
                TempleId = booking.TempleId,
                TempleName = booking.Temple.Name,
                BhaktnivasId = booking.BhaktnivasId,
                BhaktnivasName = booking.Bhaktnivas?.Name,
                DarshanSlotId = booking.DarshanSlotId,
                DarshanDate = booking.DarshanSlot?.Date,
                DarshanTime = booking.DarshanSlot != null ? 
                    $"{booking.DarshanSlot.StartTime:hh\\:mm} - {booking.DarshanSlot.EndTime:hh\\:mm}" : null,
                BookingDate = booking.BookingDate,
                CheckInDate = booking.CheckInDate,
                CheckOutDate = booking.CheckOutDate,
                TotalAmount = booking.TotalAmount,
                PaymentStatus = booking.PaymentStatus,
                BookingStatus = booking.BookingStatus,
                SpecialRequests = booking.SpecialRequests,
                CreatedAt = booking.CreatedAt
            };
        }

        public async Task<bool> CancelBookingAsync(int id, int userId)
        {
            var booking = await _context.Bookings
                .Include(b => b.DarshanSlot)
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (booking == null || booking.BookingStatus == "Cancelled")
            {
                return false;
            }

            booking.BookingStatus = "Cancelled";

            // Restore Darshan slot if applicable
            if (booking.DarshanSlotId.HasValue && booking.DarshanSlot != null)
            {
                booking.DarshanSlot.AvailableSlots++;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateBookingStatusAsync(int bookingId, string bookingStatus, int providerId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Bhaktnivas)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
            {
                return false;
            }

            // Verify provider owns the Bhaktnivas for this booking
            if (booking.Bhaktnivas != null && booking.Bhaktnivas.ServiceProviderId != providerId)
            {
                return false; // Provider doesn't own this Bhaktnivas
            }

            // Only allow certain status transitions
            var validStatuses = new[] { "Confirmed", "Cancelled", "Completed" };
            if (!validStatuses.Contains(bookingStatus))
            {
                return false;
            }

            booking.BookingStatus = bookingStatus;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePaymentStatusAsync(int bookingId, string paymentStatus)

        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null)
            {
                return false;
            }

            booking.PaymentStatus = paymentStatus;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
