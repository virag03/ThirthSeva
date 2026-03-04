using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TirthSeva.API.Models;
using TirthSeva.API.Services;

namespace TirthSeva.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TemplesController : ControllerBase
    {
        private readonly TempleService _templeService;

        public TemplesController(TempleService templeService)
        {
            _templeService = templeService;
        }

        // Public endpoints - anyone can view temples
        [HttpGet]
        public async Task<ActionResult<List<Temple>>> GetAll()
        {
            var temples = await _templeService.GetAllTemplesAsync();
            return Ok(temples);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Temple>> GetById(int id)
        {
            var temple = await _templeService.GetTempleByIdAsync(id);
            
            if (temple == null)
            {
                return NotFound();
            }

            return Ok(temple);
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<Temple>>> Search([FromQuery] string? query, [FromQuery] string? state, [FromQuery] string? city)
        {
            var temples = await _templeService.SearchTemplesAsync(query, state, city);
            return Ok(temples);
        }

        [HttpGet("states")]
        public async Task<ActionResult<List<string>>> GetStates()
        {
            var states = await _templeService.GetStatesAsync();
            return Ok(states);
        }

        [HttpGet("cities/{state}")]
        public async Task<ActionResult<List<string>>> GetCities(string state)
        {
            var cities = await _templeService.GetCitiesByStateAsync(state);
            return Ok(cities);
        }

        // Provider endpoints - requires ServiceProvider role
        [Authorize(Roles = "ServiceProvider")]
        [HttpGet("my-temples")]
        public async Task<ActionResult<List<Temple>>> GetMyTemples()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var temples = await _templeService.GetProviderTemplesAsync(userId);
            return Ok(temples);
        }

        [Authorize(Roles = "ServiceProvider")]
        [HttpPost]
        public async Task<ActionResult<Temple>> Create([FromBody] CreateTempleRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            
            var temple = new Temple
            {
                ServiceProviderId = userId,
                Name = request.Name,
                Location = request.Location,
                City = request.City,
                State = request.State,
                Description = request.Description,
                ImagePath = request.ImagePath,
                Latitude = request.Latitude,
                Longitude = request.Longitude
            };

            var created = await _templeService.CreateTempleForProviderAsync(temple);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize(Roles = "ServiceProvider")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Temple>> Update(int id, [FromBody] UpdateTempleRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            
            var temple = new Temple
            {
                Id = id,
                ServiceProviderId = userId,
                Name = request.Name,
                Location = request.Location,
                City = request.City,
                State = request.State,
                Description = request.Description,
                ImagePath = request.ImagePath,
                Latitude = request.Latitude,
                Longitude = request.Longitude
            };

            var updated = await _templeService.UpdateTempleForProviderAsync(id, temple, userId);
            
            if (updated == null)
            {
                return NotFound(new { message = "Temple not found or you don't have permission to update it" });
            }

            return Ok(updated);
        }

        [Authorize(Roles = "ServiceProvider")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var result = await _templeService.DeleteTempleForProviderAsync(id, userId);
            
            if (!result)
            {
                return NotFound(new { message = "Temple not found or you don't have permission to delete it" });
            }

            return NoContent();
        }
    }

    public class CreateTempleRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImagePath { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class UpdateTempleRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImagePath { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
