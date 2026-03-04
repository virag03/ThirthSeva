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
        public async Task<ActionResult<List<TirthSeva.API.DTOs.DarshanSlotDTO>>> GetByTemple(
            int templeId,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            var slots = await _darshanService.GetSlotsByTempleAsync(templeId, fromDate, toDate);
            return Ok(slots.Select(s => MapToDTO(s)).ToList());
        }

        [HttpGet("available")]
        public async Task<ActionResult<List<TirthSeva.API.DTOs.DarshanSlotDTO>>> GetAvailableSlots(
            [FromQuery] int templeId,
            [FromQuery] DateTime date)
        {
            var slots = await _darshanService.GetAvailableSlotsAsync(templeId, date);
            return Ok(slots.Select(s => MapToDTO(s)).ToList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TirthSeva.API.DTOs.DarshanSlotDTO>> GetById(int id)
        {
            var slot = await _darshanService.GetSlotByIdAsync(id);
            
            if (slot == null)
            {
                return NotFound();
            }

            return Ok(MapToDTO(slot));
        }

        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "ServiceProvider")]
        [HttpPost]
        public async Task<ActionResult<TirthSeva.API.DTOs.DarshanSlotDTO>> CreateSlot([FromBody] TirthSeva.API.DTOs.DarshanSlotCreateRequest request)
        {
            var slot = new DarshanSlot
            {
                TempleId = request.TempleId,
                Date = request.Date,
                StartTime = TimeSpan.Parse(request.StartTime),
                EndTime = TimeSpan.Parse(request.EndTime),
                Capacity = request.Capacity,
                AvailableSlots = request.Capacity,
                Price = request.Price
            };

            var createdSlot = await _darshanService.CreateSlotAsync(slot);
            return CreatedAtAction(nameof(GetById), new { id = createdSlot.Id }, MapToDTO(createdSlot));
        }

        private static TirthSeva.API.DTOs.DarshanSlotDTO MapToDTO(DarshanSlot s)
        {
            return new TirthSeva.API.DTOs.DarshanSlotDTO
            {
                Id = s.Id,
                TempleId = s.TempleId,
                Date = s.Date,
                StartTime = s.StartTime.ToString(@"hh\:mm"),
                EndTime = s.EndTime.ToString(@"hh\:mm"),
                Capacity = s.Capacity,
                AvailableSlots = s.AvailableSlots,
                Price = s.Price
            };
        }
    }
}
