using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;

namespace TirthSeva.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TempleDetailsController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public TempleDetailsController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet("{templeId}")]
        public async Task<ActionResult<object>> GetTempleDetails(int templeId, [FromQuery] string templeName, [FromQuery] string city, [FromQuery] string state)
        {
            try
            {
                // For now, we'll return a simple response based on the temple name
                // In production, you would integrate with a proper search API
                var details = GenerateTempleDetails(templeName, city, state);
                
                return Ok(details);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to fetch temple details", message = ex.Message });
            }
        }

        private object GenerateTempleDetails(string templeName, string city, string state)
        {
            // This is a simplified version. In production, you would use actual web search API
            // For now, we'll provide generic but helpful information
            
            var details = new
            {
                description = $"{templeName} is a revered Hindu temple located in {city}, {state}. This sacred shrine attracts thousands of devotees throughout the year who come to seek blessings and experience spiritual peace. The temple is known for its beautiful architecture, rich history, and religious significance in Hindu tradition.",
                keyInfo = new List<string>
                {
                    $"Located in {city}, {state}, India",
                    "Open for darshan throughout the year",

                    "Photography may be restricted in certain areas",
                    "Dress code: Traditional/modest clothing recommended",
                    "Best time to visit: Early morning or evening Aarti"
                },
                additionalInfo = $"The temple offers various seva and booking options for devotees. Nearby facilities include accommodation (Bhaktnivas) and shops. For specific darshan timings and special puja bookings, please contact the temple administration or check our darshan booking section.\n\nNote: This is general information. For detailed and current information about {templeName}, we recommend visiting official temple websites or contacting the temple directly."
            };

            return details;
        }
    }
}
