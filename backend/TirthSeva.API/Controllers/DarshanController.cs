using Microsoft.AspNetCore.Mvc;
using TirthSeva.API.Models;
using TirthSeva.API.Services;

namespace TirthSeva.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DarshanController : ControllerBase
    {
        private readonly DarshanService _darshanService;

        public DarshanController(DarshanService darshanService)
        {
            _darshanService = darshanService;
        }

        [HttpGet("temple/{templeId}")]
        public async Task<ActionResult<List<DarshanSlot>>> GetByTemple(
            int templeId,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            var slots = await _darshanService.GetSlotsByTempleAsync(templeId, fromDate, toDate);
            return Ok(slots);
        }

        [HttpGet("available")]
        public async Task<ActionResult<List<DarshanSlot>>> GetAvailableSlots(
            [FromQuery] int templeId,
            [FromQuery] DateTime date)
        {
            var slots = await _darshanService.GetAvailableSlotsAsync(templeId, date);
            return Ok(slots);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DarshanSlot>> GetById(int id)
        {
            var slot = await _darshanService.GetSlotByIdAsync(id);
            
            if (slot == null)
            {
                return NotFound();
            }

            return Ok(slot);
        }
    }
}
