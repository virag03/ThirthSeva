using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TirthSeva.API.Models;
using TirthSeva.API.Services;

namespace TirthSeva.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentsController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("process")]
        public async Task<ActionResult<Payment>> ProcessPayment([FromBody] ProcessPaymentRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var payment = await _paymentService.ProcessPaymentAsync(request.BookingId, request.PaymentMethod, userId);
            
            if (payment == null)
            {
                return BadRequest(new { message = "Payment failed. Booking not found or already paid." });
            }

            return Ok(payment);
        }

        [HttpPost("verify")]
        public async Task<ActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request)
        {
            var result = await _paymentService.VerifyPaymentAsync(request.TransactionId);
            
            if (!result)
            {
                return NotFound(new { message = "Payment not found or failed" });
            }

            return Ok(new { message = "Payment verified successfully", status = "Success" });
        }

        [HttpGet("history")]
        public async Task<ActionResult<List<Payment>>> GetPaymentHistory()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var payments = await _paymentService.GetPaymentHistoryAsync(userId);
            return Ok(payments);
        }

        [HttpGet("booking/{bookingId}")]
        public async Task<ActionResult<Payment>> GetPaymentByBooking(int bookingId)
        {
            var payment = await _paymentService.GetPaymentByBookingIdAsync(bookingId);
            
            if (payment == null)
            {
                return NotFound();
            }

            return Ok(payment);
        }
    }

    public class ProcessPaymentRequest
    {
        public int BookingId { get; set; }
        public string PaymentMethod { get; set; } = "Mock";
    }

    public class VerifyPaymentRequest
    {
        public string TransactionId { get; set; } = string.Empty;
    }
}
