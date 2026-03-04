using TirthSeva.API.Data;
using TirthSeva.API.Models;
using Microsoft.EntityFrameworkCore;

namespace TirthSeva.API.Services
{
    public class PaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly BookingService _bookingService;

        public PaymentService(ApplicationDbContext context, BookingService bookingService)
        {
            _context = context;
            _bookingService = bookingService;
        }

        public async Task<Payment?> ProcessPaymentAsync(int bookingId, string paymentMethod, int userId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);

            if (booking == null || booking.UserId != userId)
            {
                return null;
            }

            // Check if already paid
            var existingPayment = await _context.Payments.FirstOrDefaultAsync(p => p.BookingId == bookingId);
            if (existingPayment != null)
            {
                return null;
            }

            // Mock payment processing
            var payment = new Payment
            {
                BookingId = bookingId,
                Amount = booking.TotalAmount,
                PaymentMethod = paymentMethod,
                TransactionId = $"TXN_{Guid.NewGuid().ToString().Substring(0, 12).ToUpper()}",
                Status = "Success",
                CreatedAt = DateTime.UtcNow,
                CompletedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            
            // Update booking payment status
            await _bookingService.UpdatePaymentStatusAsync(bookingId, "Completed");

            await _context.SaveChangesAsync();

            return payment;
        }

        public async Task<Payment?> GetPaymentByBookingIdAsync(int bookingId)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.BookingId == bookingId);
        }

        public async Task<List<Payment>> GetPaymentHistoryAsync(int userId)
        {
            return await _context.Payments
                .Include(p => p.Booking)
                .Where(p => p.Booking.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> VerifyPaymentAsync(string transactionId)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.TransactionId == transactionId);

            return payment != null && payment.Status == "Success";
        }
    }
}
