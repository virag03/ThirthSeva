using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TirthSeva.API.DTOs;
using TirthSeva.API.Services;

namespace TirthSeva.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingsController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<ActionResult> CreateBooking([FromBody] CreateBookingRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var booking = await _bookingService.CreateBookingAsync(request, userId);
            
            if (booking == null)
            {
                return BadRequest(new { message = "Booking failed. Check availability." });
            }

            return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
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
