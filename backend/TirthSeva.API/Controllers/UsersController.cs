using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TirthSeva.API.DTOs;
using TirthSeva.API.Services;

namespace TirthSeva.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserProfileResponse>>> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserProfileResponse>> GetById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _userService.DeleteUserAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPut("{id}/role")]
        public async Task<ActionResult> UpdateRole(int id, [FromBody] UpdateRoleRequest request)
        {
            var result = await _userService.UpdateUserRoleAsync(id, request.Role);

            if (!result)
            {
                return BadRequest(new { message = "User not found or invalid role" });
            }

            return Ok(new { message = "User role updated successfully" });
        }
    }

    public class UpdateRoleRequest
    {
        public string Role { get; set; } = string.Empty;
    }
}
