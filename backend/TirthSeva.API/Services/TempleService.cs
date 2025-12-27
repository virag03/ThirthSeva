using Microsoft.EntityFrameworkCore;
using TirthSeva.API.Data;
using TirthSeva.API.Models;

namespace TirthSeva.API.Services
{
    public class TempleService
    {
        private readonly ApplicationDbContext _context;

        public TempleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Temple>> GetAllTemplesAsync()
        {
            return await _context.Temples
                .OrderBy(t => t.Name)
                .ToListAsync();
        }

        public async Task<Temple?> GetTempleByIdAsync(int id)
        {
            return await _context.Temples.FindAsync(id);
        }

        public async Task<List<Temple>> SearchTemplesAsync(string? query, string? state, string? city)
        {
            var templesQuery = _context.Temples.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                templesQuery = templesQuery.Where(t => 
                    t.Name.Contains(query) || 
                    t.Description.Contains(query) ||
                    t.City.Contains(query) ||
                    t.State.Contains(query)
                );
            }

            if (!string.IsNullOrWhiteSpace(state))
            {
                templesQuery = templesQuery.Where(t => t.State == state);
            }

            if (!string.IsNullOrWhiteSpace(city))
            {
                templesQuery = templesQuery.Where(t => t.City == city);
            }

            return await templesQuery
                .OrderBy(t => t.Name)
                .ToListAsync();
        }

        public async Task<Temple> CreateTempleAsync(Temple temple)
        {
            temple.CreatedAt = DateTime.UtcNow;
            _context.Temples.Add(temple);
            await _context.SaveChangesAsync();
            return temple;
        }

        public async Task<Temple?> UpdateTempleAsync(int id, Temple updatedTemple)
        {
            var temple = await _context.Temples.FindAsync(id);
            if (temple == null)
            {
                return null;
            }

            temple.Name = updatedTemple.Name;
            temple.Location = updatedTemple.Location;
            temple.City = updatedTemple.City;
            temple.State = updatedTemple.State;
            temple.Description = updatedTemple.Description;
            temple.ImagePath = updatedTemple.ImagePath;
            temple.Latitude = updatedTemple.Latitude;
            temple.Longitude = updatedTemple.Longitude;

            await _context.SaveChangesAsync();
            return temple;
        }

        public async Task<bool> DeleteTempleAsync(int id)
        {
            var temple = await _context.Temples.FindAsync(id);
            if (temple == null)
            {
                return false;
            }

            _context.Temples.Remove(temple);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<string>> GetStatesAsync()
        {
            return await _context.Temples
                .Select(t => t.State)
                .Distinct()
                .OrderBy(s => s)
                .ToListAsync();
        }

        public async Task<List<string>> GetCitiesByStateAsync(string state)
        {
            return await _context.Temples
                .Where(t => t.State == state)
                .Select(t => t.City)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }

        // Provider-specific methods
        public async Task<List<Temple>> GetProviderTemplesAsync(int providerId)
        {
            return await _context.Temples
                .Where(t => t.ServiceProviderId == providerId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<Temple> CreateTempleForProviderAsync(Temple temple)
        {
            temple.CreatedAt = DateTime.UtcNow;
            _context.Temples.Add(temple);
            await _context.SaveChangesAsync();
            return temple;
        }

        public async Task<Temple?> UpdateTempleForProviderAsync(int id, Temple updatedTemple, int providerId)
        {
            var temple = await _context.Temples.FindAsync(id);
            if (temple == null || temple.ServiceProviderId != providerId)
            {
                return null; // Temple doesn't exist or provider doesn't own it
            }

            temple.Name = updatedTemple.Name;
            temple.Location = updatedTemple.Location;
            temple.City = updatedTemple.City;
            temple.State = updatedTemple.State;
            temple.Description = updatedTemple.Description;
            temple.ImagePath = updatedTemple.ImagePath;
            temple.Latitude = updatedTemple.Latitude;
            temple.Longitude = updatedTemple.Longitude;

            await _context.SaveChangesAsync();
            return temple;
        }

        public async Task<bool> DeleteTempleForProviderAsync(int id, int providerId)
        {
            var temple = await _context.Temples.FindAsync(id);
            if (temple == null || temple.ServiceProviderId != providerId)
            {
                return false; // Temple doesn't exist or provider doesn't own it
            }

            _context.Temples.Remove(temple);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
