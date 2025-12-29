using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TirthSeva.API.Data;
using TirthSeva.API.DTOs;
using TirthSeva.API.Helpers;
using TirthSeva.API.Services;

namespace TirthSeva.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly ApplicationDbContext _context;

        public AuthController(AuthService authService, ApplicationDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginResponse>> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request);

            if (result == null)
            {
                return BadRequest(new { message = "Email already exists or registration failed" });
            }

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            return Ok(result);
        }

        [HttpPost("verify-otp")]
        public async Task<ActionResult> VerifyOTP([FromBody] VerifyOTPRequest request)
        {
            var result = await _authService.VerifyOTPAsync(request.Email, request.OTP);

            if (!result)
            {
                return BadRequest(new { message = "Invalid or expired OTP" });
            }

            return Ok(new { message = "Email verified successfully" });
        }

        [HttpPost("resend-otp")]
        public async Task<ActionResult> ResendOTP([FromBody] ResendOTPRequest request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                
                if (user == null || user.IsEmailVerified)
                {
                    return BadRequest(new { message = "User not found or already verified" });
                }

                // Generate new OTP
                var otp = new Random().Next(100000, 999999).ToString();
                user.EmailOTP = otp;
                user.OTPExpiry = DateTime.UtcNow.AddMinutes(10);
                
                await _context.SaveChangesAsync();

                // Send OTP email
                var emailHelper = HttpContext.RequestServices.GetRequiredService<EmailHelper>();
                await emailHelper.SendOTPEmailAsync(user.Email, user.Name, otp);

                return Ok(new { message = "OTP sent successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to resend OTP", error = ex.Message });
            }
        }

        [HttpGet("test-otp/{email}")]
        public async Task<ActionResult> TestOTP(string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(new {
                    email = user.Email,
                    name = user.Name,
                    isVerified = user.IsEmailVerified,
                    currentOTP = user.EmailOTP,
                    otpExpiry = user.OTPExpiry,
                    isOTPValid = user.OTPExpiry > DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserProfileResponse>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var user = await _authService.GetUserByIdAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}