using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TirthSeva.API.DTOs;
using TirthSeva.API.Services;

namespace TirthSeva.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BhaktnivasController : ControllerBase
    {
        private readonly BhaktnivasService _bhaktnivasService;
        public BhaktnivasController(BhaktnivasService bhaktnivasService)
        {
            _bhaktnivasService = bhaktnivasService;
        }

        [HttpGet]
        public async Task<ActionResult<List<BhaktnivasListDTO>>> GetAll(
            [FromQuery] int? templeId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] bool? isAvailable)
        {
            var bhaktnivas = await _bhaktnivasService.GetAllBhaktnivasAsync(templeId, minPrice, maxPrice, isAvailable);
            return Ok(bhaktnivas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BhaktnivasDetailDTO>> GetById(int id)
        {
            var bhaktnivas = await _bhaktnivasService.GetBhaktnivasByIdAsync(id);
            
            if (bhaktnivas == null)
            {
                return NotFound();
            }

            return Ok(bhaktnivas);
        }

        [Authorize(Roles = "ServiceProvider,Admin")]
        [HttpGet("my-listings")]
        public async Task<ActionResult<List<BhaktnivasListDTO>>> GetMyListings()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var listings = await _bhaktnivasService.GetBhaktnivasByProviderAsync(userId);
            return Ok(listings);
        }

        [Authorize(Roles = "ServiceProvider")]
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateBhaktnivasRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var bhaktnivas = await _bhaktnivasService.CreateBhaktnivasAsync(request, userId);
            
            if (bhaktnivas == null)
            {
                return BadRequest();
            }

            return CreatedAtAction(nameof(GetById), new { id = bhaktnivas.Id }, bhaktnivas);
        }

        [Authorize(Roles = "ServiceProvider,Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] UpdateBhaktnivasRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            
            // Admin can update any listing, ServiceProvider can only update their own
            int? serviceProviderId = userRole == "Admin" ? null : userId;
            
            var bhaktnivas = await _bhaktnivasService.UpdateBhaktnivasAsync(id, request, serviceProviderId);
            
            if (bhaktnivas == null)
            {
                return NotFound();
            }

            return Ok(bhaktnivas);
        }

        [Authorize(Roles = "ServiceProvider,Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            
            // Admin can delete any listing, ServiceProvider can only delete their own
            int? serviceProviderId = userRole == "Admin" ? null : userId;
            
            var result = await _bhaktnivasService.DeleteBhaktnivasAsync(id, serviceProviderId);
            
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [Authorize(Roles = "ServiceProvider")]
        [HttpPatch("{id}/availability")]
        public async Task<ActionResult> UpdateAvailability(int id, [FromBody] bool isAvailable)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var result = await _bhaktnivasService.UpdateAvailabilityAsync(id, isAvailable, userId);
            
            if (!result)
            {
                return NotFound();
            }

            return Ok(new { message = "Availability updated successfully" });
        }
    }
}
