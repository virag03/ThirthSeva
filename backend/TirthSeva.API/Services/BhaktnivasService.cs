using Microsoft.EntityFrameworkCore;
using TirthSeva.API.Data;
using TirthSeva.API.DTOs;
using TirthSeva.API.Models;

namespace TirthSeva.API.Services
{
    public class BhaktnivasService
    {
        private readonly ApplicationDbContext _context;

        public BhaktnivasService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<BhaktnivasListDTO>> GetAllBhaktnivasAsync(int? templeId, decimal? minPrice, decimal? maxPrice, bool? isAvailable)
        {
            var query = _context.Bhaktnivas
                .Include(b => b.Temple)
                .Include(b => b.ServiceProvider)
                .AsQueryable();

            if (templeId.HasValue)
            {
                query = query.Where(b => b.TempleId == templeId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(b => b.PricePerNight >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(b => b.PricePerNight <= maxPrice.Value);
            }

            if (isAvailable.HasValue)
            {
                query = query.Where(b => b.IsAvailable == isAvailable.Value);
            }

            return await query
                .OrderBy(b => b.PricePerNight)
                .Select(b => new BhaktnivasListDTO
                {
                    Id = b.Id,
                    TempleId = b.TempleId,
                    TempleName = b.Temple.Name,
                    Name = b.Name,
                    PricePerNight = b.PricePerNight,
                    Capacity = b.Capacity,
                    IsAvailable = b.IsAvailable,
                    DistanceFromTemple = b.DistanceFromTemple,
                    ImageUrl = b.ImageUrl,
                    ServiceProviderName = b.ServiceProvider.Name
                })
                .ToListAsync();
        }

        public async Task<BhaktnivasDetailDTO?> GetBhaktnivasByIdAsync(int id)
        {
            var bhaktnivas = await _context.Bhaktnivas
                .Include(b => b.Temple)
                .Include(b => b.ServiceProvider)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (bhaktnivas == null)
            {
                return null;
            }

            return new BhaktnivasDetailDTO
            {
                Id = bhaktnivas.Id,
                TempleId = bhaktnivas.TempleId,
                TempleName = bhaktnivas.Temple.Name,
                Name = bhaktnivas.Name,
                Description = bhaktnivas.Description,
                PricePerNight = bhaktnivas.PricePerNight,
                Capacity = bhaktnivas.Capacity,
                IsAvailable = bhaktnivas.IsAvailable,
                DistanceFromTemple = bhaktnivas.DistanceFromTemple,
                ImageUrl = bhaktnivas.ImageUrl,
                ServiceProviderId = bhaktnivas.ServiceProviderId,
                ServiceProviderName = bhaktnivas.ServiceProvider.Name,
                CreatedAt = bhaktnivas.CreatedAt
            };
        }

        public async Task<List<BhaktnivasListDTO>> GetBhaktnivasByProviderAsync(int providerId)
        {
            return await _context.Bhaktnivas
                .Include(b => b.Temple)
                .Include(b => b.ServiceProvider)
                .Where(b => b.ServiceProviderId == providerId)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BhaktnivasListDTO
                {
                    Id = b.Id,
                    TempleId = b.TempleId,
                    TempleName = b.Temple.Name,
                    Name = b.Name,
                    PricePerNight = b.PricePerNight,
                    Capacity = b.Capacity,
                    IsAvailable = b.IsAvailable,
                    DistanceFromTemple = b.DistanceFromTemple,
                    ImageUrl = b.ImageUrl,
                    ServiceProviderName = b.ServiceProvider.Name
                })
                .ToListAsync();
        }

        public async Task<Bhaktnivas?> CreateBhaktnivasAsync(CreateBhaktnivasRequest request, int serviceProviderId)
        {
            var bhaktnivas = new Bhaktnivas
            {
                TempleId = request.TempleId,
                ServiceProviderId = serviceProviderId,
                Name = request.Name,
                Description = request.Description,
                PricePerNight = request.PricePerNight,
                Capacity = request.Capacity,
                DistanceFromTemple = request.DistanceFromTemple,
                ImageUrl = request.ImageUrl,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bhaktnivas.Add(bhaktnivas);
            await _context.SaveChangesAsync();

            return bhaktnivas;
        }

        public async Task<Bhaktnivas?> UpdateBhaktnivasAsync(int id, UpdateBhaktnivasRequest request, int? serviceProviderId = null)
        {
            var bhaktnivas = await _context.Bhaktnivas.FindAsync(id);
            if (bhaktnivas == null)
            {
                return null;
            }

            // If service provider ID is provided, check ownership
            if (serviceProviderId.HasValue && bhaktnivas.ServiceProviderId != serviceProviderId.Value)
            {
                return null; // Not authorized
            }

            bhaktnivas.TempleId = request.TempleId;
            bhaktnivas.Name = request.Name;
            bhaktnivas.Description = request.Description;
            bhaktnivas.PricePerNight = request.PricePerNight;
            bhaktnivas.Capacity = request.Capacity;
            bhaktnivas.DistanceFromTemple = request.DistanceFromTemple;
            bhaktnivas.ImageUrl = request.ImageUrl;
            bhaktnivas.IsAvailable = request.IsAvailable;

            await _context.SaveChangesAsync();
            return bhaktnivas;
        }

        public async Task<bool> DeleteBhaktnivasAsync(int id, int? serviceProviderId = null)
        {
            var bhaktnivas = await _context.Bhaktnivas.FindAsync(id);
            if (bhaktnivas == null)
            {
                return false;
            }

            // If service provider ID is provided, check ownership
            if (serviceProviderId.HasValue && bhaktnivas.ServiceProviderId != serviceProviderId.Value)
            {
                return false; // Not authorized
            }

            _context.Bhaktnivas.Remove(bhaktnivas);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAvailabilityAsync(int id, bool isAvailable, int serviceProviderId)
        {
            var bhaktnivas = await _context.Bhaktnivas.FindAsync(id);
            if (bhaktnivas == null || bhaktnivas.ServiceProviderId != serviceProviderId)
            {
                return false;
            }

            bhaktnivas.IsAvailable = isAvailable;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
