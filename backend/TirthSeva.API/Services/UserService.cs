using Microsoft.EntityFrameworkCore;
using TirthSeva.API.Data;
using TirthSeva.API.DTOs;
using TirthSeva.API.Models;

namespace TirthSeva.API.Services
{
    public class UserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserProfileResponse>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new UserProfileResponse
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role,
                    IsEmailVerified = u.IsEmailVerified,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<UserProfileResponse?> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

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

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateUserRoleAsync(int id, string newRole)
        {
            // Validate role
            if (newRole != "User" && newRole != "ServiceProvider" && newRole != "Admin")
            {
                return false;
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return false;
            }

            user.Role = newRole;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
