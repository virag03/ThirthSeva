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

        public async Task<bool> ValidateBookingAvailabilityAsync(CreateBookingRequest request)
        {
            // Validate booking
            if (!request.BhaktnivasId.HasValue && !request.DarshanSlotId.HasValue)
            {
                return false; // Must book either Bhaktnivas or Darshan
            }

            // Validate NumberOfPersons for Darshan (max 4)
            if (request.DarshanSlotId.HasValue && (request.NumberOfPersons < 1 || request.NumberOfPersons > 4))
            {
                return false;
            }

            // Check Darshan slot availability if booking Darshan
            if (request.DarshanSlotId.HasValue)
            {
                var darshanSlot = await _context.DarshanSlots.FindAsync(request.DarshanSlotId.Value);
                if (darshanSlot == null || darshanSlot.AvailableSlots < request.NumberOfPersons)
                {
                    return false; // Slot not available or insufficient capacity
                }
            }

            // Check Bhaktnivas availability if booking Bhaktnivas
            if (request.BhaktnivasId.HasValue && request.CheckInDate.HasValue && request.CheckOutDate.HasValue)
            {
                var checkIn = request.CheckInDate.Value.Date;
                var checkOut = request.CheckOutDate.Value.Date;
                
                var slots = await _context.BhaktnivasSlots
                    .Where(s => s.BhaktnivasId == request.BhaktnivasId.Value && s.Date >= checkIn && s.Date < checkOut)
                    .ToListAsync();

                var nightsCount = (checkOut - checkIn).Days;
                if (slots.Count < nightsCount)
                {
                    return false; // Some dates don't have slots released
                }

                foreach (var slot in slots)
                {
                    if (slot.AvailableCapacity < request.NumberOfPersons)
                    {
                        return false; // Insufficient capacity on at least one day
                    }
                }
            }

            return true;
        }

        public async Task<Booking?> CreateBookingWithPaymentAsync(CreateBookingRequest request, int userId)
        {
            // Validate availability before creating booking
            if (!await ValidateBookingAvailabilityAsync(request))
            {
                return null;
            }

            // Decrement availability since payment is successful
            if (request.DarshanSlotId.HasValue)
            {
                var darshanSlot = await _context.DarshanSlots.FindAsync(request.DarshanSlotId.Value);
                if (darshanSlot != null)
                {
                    darshanSlot.AvailableSlots -= request.NumberOfPersons;
                }
            }

            if (request.BhaktnivasId.HasValue && request.CheckInDate.HasValue && request.CheckOutDate.HasValue)
            {
                var checkIn = request.CheckInDate.Value.Date;
                var checkOut = request.CheckOutDate.Value.Date;
                
                var slots = await _context.BhaktnivasSlots
                    .Where(s => s.BhaktnivasId == request.BhaktnivasId.Value && s.Date >= checkIn && s.Date < checkOut)
                    .ToListAsync();

                foreach (var slot in slots)
                {
                    slot.AvailableCapacity -= request.NumberOfPersons;
                }
            }

            var booking = new Booking
            {
                UserId = userId,
                TempleId = request.TempleId,
                BhaktnivasId = request.BhaktnivasId,
                DarshanSlotId = request.DarshanSlotId,
                NumberOfPersons = request.NumberOfPersons,
                BookingDate = DateTime.UtcNow,
                CheckInDate = request.CheckInDate,
                CheckOutDate = request.CheckOutDate,
                TotalAmount = request.TotalAmount,
                PaymentStatus = "Completed",
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
                    BookingStatus = b.BookingStatus,
                    NumberOfPersons = b.NumberOfPersons
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
                    BookingStatus = b.BookingStatus,
                    NumberOfPersons = b.NumberOfPersons
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
                    NumberOfPersons = b.NumberOfPersons,
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
                NumberOfPersons = booking.NumberOfPersons,
                SpecialRequests = booking.SpecialRequests,
                CreatedAt = booking.CreatedAt
            };
        }

        public async Task<bool> CancelBookingAsync(int id, int? userId = null)
        {
            // If userId is 0, it means Admin is performing the action (we will handle 0 as Admin flag from controller)
            // Or we can pass a nullable int? userId.
            // Let's assume the controller passes the userId.
            // Actually, for Admin, we might want to bypass the userId check.
            // Let's modify the signature or logic.
            // Better approach: Check if userId matches OR if the caller is Admin. 
            // Since we don't pass roles here, let's treat userId=0 as "force/admin" or change signature.
            // But to keep it simple and consistent with existing patterns, let's change signature to accept isUser (true/false) or similar.
            // For now, let's look at how we call it. Users cancel their own. Admins cancel any?
            // The method is `CancelBookingAsync(int id, int userId)`.
            // Let's change it to `CancelBookingAsync(int id, int? userId = null)`. If userId is null, it's Admin.
            
            var query = _context.Bookings
                .Include(b => b.DarshanSlot)
                .AsQueryable();

            if (userId.HasValue)
            {
                query = query.Where(b => b.UserId == userId.Value);
            }

            var booking = await query.FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null || booking.BookingStatus == "Cancelled")
            {
                return false;
            }

            booking.BookingStatus = "Cancelled";

            // Restore Darshan slot if applicable
            if (booking.DarshanSlotId.HasValue && booking.DarshanSlot != null)
            {
                booking.DarshanSlot.AvailableSlots += booking.NumberOfPersons;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateBookingStatusAsync(int bookingId, string bookingStatus, int? providerId = null)
        {
            var booking = await _context.Bookings
                .Include(b => b.Bhaktnivas)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
            {
                return false;
            }

            // Verify provider owns the Bhaktnivas for this booking
            // If providerId is null, it means Admin
            if (providerId.HasValue && booking.Bhaktnivas != null && booking.Bhaktnivas.ServiceProviderId != providerId.Value)
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
