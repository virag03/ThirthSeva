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
            try
            {
                // Check if email already exists
                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                {
                    return null;
                }

                // Generate 6-digit OTP
                var otp = new Random().Next(100000, 999999).ToString();

                // Create new user
                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Role = request.Role,
                    IsEmailVerified = false,
                    EmailOTP = otp,
                    OTPExpiry = DateTime.UtcNow.AddMinutes(10),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Send OTP email
                await _emailHelper.SendOTPEmailAsync(user.Email, user.Name, otp);

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
            catch (Exception ex)
            {
                Console.WriteLine($"Registration error: {ex.Message}");
                return null;
            }
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return null;
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
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> VerifyOTPAsync(string email, string otp)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

                if (user == null || user.EmailOTP != otp || user.OTPExpiry < DateTime.UtcNow)
                {
                    return false;
                }

                user.IsEmailVerified = true;
                user.EmailOTP = null;
                user.OTPExpiry = null;

                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
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