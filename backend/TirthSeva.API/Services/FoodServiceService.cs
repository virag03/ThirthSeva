using Microsoft.EntityFrameworkCore;
using TirthSeva.API.Data;
using TirthSeva.API.Models;

namespace TirthSeva.API.Services
{
    public class FoodServiceService
    {
        private readonly ApplicationDbContext _context;

        public FoodServiceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<FoodService>> GetServicesByTempleAsync(int templeId, string? type)
        {
            var query = _context.FoodServices
                .Where(f => f.TempleId == templeId);

            if (!string.IsNullOrWhiteSpace(type))
            {
                query = query.Where(f => f.Type == type);
            }

            return await query
                .OrderBy(f => f.AveragePrice)
                .ToListAsync();
        }

        public async Task<FoodService?> GetServiceByIdAsync(int id)
        {
            return await _context.FoodServices.FindAsync(id);
        }

        public async Task<FoodService> CreateServiceAsync(FoodService service)
        {
            service.CreatedAt = DateTime.UtcNow;
            _context.FoodServices.Add(service);
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<FoodService?> UpdateServiceAsync(int id, FoodService updatedService)
        {
            var service = await _context.FoodServices.FindAsync(id);
            if (service == null)
            {
                return null;
            }

            service.Name = updatedService.Name;
            service.Type = updatedService.Type;
            service.Timing = updatedService.Timing;
            service.Distance = updatedService.Distance;
            service.AveragePrice = updatedService.AveragePrice;
            service.Description = updatedService.Description;

            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<bool> DeleteServiceAsync(int id)
        {
            var service = await _context.FoodServices.FindAsync(id);
            if (service == null)
            {
                return false;
            }

            _context.FoodServices.Remove(service);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
