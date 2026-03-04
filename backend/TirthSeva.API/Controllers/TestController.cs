using Microsoft.AspNetCore.Mvc;

namespace TirthSeva.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet("health")]
        public ActionResult Health()
        {
            return Ok(new { status = "API is running", timestamp = DateTime.UtcNow });
        }
    }
}