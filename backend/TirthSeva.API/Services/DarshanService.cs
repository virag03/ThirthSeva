using Microsoft.EntityFrameworkCore;
using TirthSeva.API.Data;
using TirthSeva.API.Models;

namespace TirthSeva.API.Services
{
    public class DarshanService
    {
        private readonly ApplicationDbContext _context;

        public DarshanService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DarshanSlot>> GetSlotsByTempleAsync(int templeId, DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.DarshanSlots
                .Where(d => d.TempleId == templeId);

            if (fromDate.HasValue)
            {
                query = query.Where(d => d.Date >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(d => d.Date <= toDate.Value);
            }

            return await query
                .OrderBy(d => d.Date)
                .ThenBy(d => d.StartTime)
                .ToListAsync();
        }

        public async Task<List<DarshanSlot>> GetAvailableSlotsAsync(int templeId, DateTime date)
        {
            return await _context.DarshanSlots
                .Where(d => d.TempleId == templeId && d.Date.Date == date.Date && d.AvailableSlots > 0)
                .OrderBy(d => d.StartTime)
                .ToListAsync();
        }

        public async Task<DarshanSlot?> GetSlotByIdAsync(int id)
        {
            return await _context.DarshanSlots.FindAsync(id);
        }
    }
}
