using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TirthSeva.API.Models;
using TirthSeva.API.Services;

namespace TirthSeva.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodServicesController : ControllerBase
    {
        private readonly FoodServiceService _foodService;

        public FoodServicesController(FoodServiceService foodService)
        {
            _foodService = foodService;
        }

        [HttpGet("temple/{templeId}")]
        public async Task<ActionResult<List<FoodService>>> GetByTemple(
            int templeId,
            [FromQuery] string? type)
        {
            var services = await _foodService.GetServicesByTempleAsync(templeId, type);
            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FoodService>> GetById(int id)
        {
            var service = await _foodService.GetServiceByIdAsync(id);
            
            if (service == null)
            {
                return NotFound();
            }

            return Ok(service);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<FoodService>> Create([FromBody] FoodService service)
        {
            var created = await _foodService.CreateServiceAsync(service);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<FoodService>> Update(int id, [FromBody] FoodService service)
        {
            var updated = await _foodService.UpdateServiceAsync(id, service);
            
            if (updated == null)
            {
                return NotFound();
            }

            return Ok(updated);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _foodService.DeleteServiceAsync(id);
            
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
