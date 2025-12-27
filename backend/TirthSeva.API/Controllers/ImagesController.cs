using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TirthSeva.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private const long MaxFileSize = 5 * 1024 * 1024; // 5MB
        private readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };

        public ImagesController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("upload")]
        public async Task<ActionResult<string>> UploadImage([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest(new { message = "No image file provided" });
            }

            // Validate file size
            if (image.Length > MaxFileSize)
            {
                return BadRequest(new { message = "File size exceeds 5MB limit" });
            }

            // Validate file extension
            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = "Only JPG, JPEG, PNG, and WEBP files are allowed" });
            }

            try
            {
                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "temples");
                
                // Ensure directory exists
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                // Return relative path that can be used in URLs
                var relativePath = $"/uploads/temples/{fileName}";
                return Ok(new { imagePath = relativePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error uploading image: {ex.Message}" });
            }
        }

        [HttpDelete("delete")]
        public ActionResult DeleteImage([FromQuery] string imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
            {
                return BadRequest(new { message = "Image path is required" });
            }

            try
            {
                // Remove leading slash if present
                var path = imagePath.TrimStart('/');
                var fullPath = Path.Combine(_environment.WebRootPath, path);

                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                    return Ok(new { message = "Image deleted successfully" });
                }

                return NotFound(new { message = "Image not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error deleting image: {ex.Message}" });
            }
        }
    }
}
