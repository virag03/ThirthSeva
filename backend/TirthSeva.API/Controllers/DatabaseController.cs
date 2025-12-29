using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TirthSeva.API.Data;

namespace TirthSeva.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatabaseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DatabaseController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult> GetStats()
        {
            try
            {
                var stats = new
                {
                    TotalUsers = await _context.Users.CountAsync(),
                    VerifiedUsers = await _context.Users.CountAsync(u => u.IsEmailVerified),
                    UnverifiedUsers = await _context.Users.CountAsync(u => !u.IsEmailVerified)
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("users")]
        public async Task<ActionResult> GetUsers()
        {
            try
            {
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.Id,
                        u.Name,
                        u.Email,
                        u.Role,
                        u.IsEmailVerified,
                        u.EmailOTP,
                        u.OTPExpiry,
                        u.CreatedAt
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}