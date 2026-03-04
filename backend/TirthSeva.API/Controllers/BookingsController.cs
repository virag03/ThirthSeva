using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TirthSeva.API.DTOs;
using TirthSeva.API.Services;
using Microsoft.EntityFrameworkCore;
using TirthSeva.API.Models;

namespace TirthSeva.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly BookingService _bookingService;
        private readonly IConfiguration _configuration;
        private readonly TirthSeva.API.Data.ApplicationDbContext _context;

        public BookingsController(BookingService bookingService, IConfiguration configuration, TirthSeva.API.Data.ApplicationDbContext context)
        {
            _bookingService = bookingService;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("validate")]
        public async Task<ActionResult> ValidateBooking([FromBody] CreateBookingRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var isAvailable = await _bookingService.ValidateBookingAvailabilityAsync(request);
            
            if (!isAvailable)
            {
                return BadRequest(new { message = "Selected slot is no longer available" });
            }

            return Ok(new { message = "Slot is available" });
        }

        [HttpPost("confirm-and-book")]
        public async Task<ActionResult> ConfirmPaymentAndBook([FromBody] CreateBookingRequest request, [FromQuery] string transactionId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            
            // Validate availability first (without decreasing occupancy)
            var isAvailable = await _bookingService.ValidateBookingAvailabilityAsync(request);
            if (!isAvailable)
            {
                return BadRequest(new { message = "Booking failed. Slot no longer available." });
            }

            // Create booking with payment completed status
            var booking = await _bookingService.CreateBookingWithPaymentAsync(request, userId);
            
            if (booking == null)
            {
                return BadRequest(new { message = "Booking failed. Slot no longer available." });
            }

            // Create payment record
            var payment = new TirthSeva.API.Models.Payment
            {
                BookingId = booking.Id,
                Amount = booking.TotalAmount,
                PaymentMethod = "Razorpay",
                TransactionId = transactionId,
                Status = "Success",
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            var bookingDto = await _bookingService.GetBookingByIdAsync(booking.Id);
            return Ok(bookingDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDetailDTO>> GetBookingById(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            
            if (booking == null)
            {
                return NotFound();
            }

            return Ok(booking);
        }

        [HttpGet("my-bookings")]
        public async Task<ActionResult<List<BookingListDTO>>> GetMyBookings()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var bookings = await _bookingService.GetUserBookingsAsync(userId);
            return Ok(bookings);
        }

        [Authorize(Roles = "ServiceProvider")]
        [HttpGet("provider-bookings")]
        public async Task<ActionResult<List<BookingListDTO>>> GetProviderBookings()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var bookings = await _bookingService.GetProviderBookingsAsync(userId);
            return Ok(bookings);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<ActionResult<List<BookingDetailDTO>>> GetAllBookings()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> CancelBooking(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Admin can cancel any booking, User can only cancel their own
            int? bookingUserId = userRole == "Admin" ? null : userId;

            var result = await _bookingService.CancelBookingAsync(id, bookingUserId);
            
            if (!result)
            {
                return NotFound();
            }

            return Ok(new { message = "Booking cancelled successfully" });
        }

        [Authorize(Roles = "ServiceProvider,Admin")]
        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateBookingStatus(int id, [FromBody] UpdateBookingStatusRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            
            // Admin can update any booking status, Provider can only update their own
            int? providerId = userRole == "Admin" ? null : userId;

            var result = await _bookingService.UpdateBookingStatusAsync(id, request.BookingStatus, providerId);
            
            if (!result)
            {
                return NotFound(new { message = "Booking not found or you don't have permission to update it" });
            }

            return Ok(new { message = $"Booking status updated to {request.BookingStatus}" });
        }


    }

    public class UpdateBookingStatusRequest
    {
        public string BookingStatus { get; set; } = string.Empty;
    }
}
