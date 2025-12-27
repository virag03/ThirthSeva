using Microsoft.EntityFrameworkCore;
using TirthSeva.API.Data;
using TirthSeva.API.DTOs;
using TirthSeva.API.Helpers;
using TirthSeva.API.Models;

namespace TirthSeva.API.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtHelper _jwtHelper;
        private readonly EmailHelper _emailHelper;

        public AuthService(ApplicationDbContext context, JwtHelper jwtHelper, EmailHelper emailHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
            _emailHelper = emailHelper;
        }

        public async Task<LoginResponse?> RegisterAsync(RegisterRequest request)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return null; // User already exists
            }

            // Validate role
            if (request.Role != "User" && request.Role != "ServiceProvider")
            {
                return null; // Invalid role
            }

            // Create new user
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role,
                IsEmailVerified = false,
                EmailVerificationToken = Guid.NewGuid().ToString(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Send verification email
            await _emailHelper.SendVerificationEmailAsync(user.Email, user.Name, user.EmailVerificationToken);

            // Generate JWT token
            var token = _jwtHelper.GenerateToken(user.Id, user.Email, user.Role);

            return new LoginResponse
            {
                Token = token,
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                IsEmailVerified = user.IsEmailVerified
            };
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null; // Invalid credentials
            }

            var token = _jwtHelper.GenerateToken(user.Id, user.Email, user.Role);

            return new LoginResponse
            {
                Token = token,
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                IsEmailVerified = user.IsEmailVerified
            };
        }

        public async Task<bool> VerifyEmailAsync(string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailVerificationToken == token);

            if (user == null)
            {
                return false;
            }

            user.IsEmailVerified = true;
            user.EmailVerificationToken = null;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<UserProfileResponse?> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return null;
            }

            return new UserProfileResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                IsEmailVerified = user.IsEmailVerified,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
