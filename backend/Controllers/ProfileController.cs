using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DiscoverMadina.Repositories.Interfaces;
using System.Security.Claims;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IUserRepository _userRepo;
    private readonly IAdminRepository _adminRepo;
    private readonly IReviewRepository _reviewRepo;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(
        IUserRepository userRepo,
        IAdminRepository adminRepo,
        IReviewRepository reviewRepo,
        IWebHostEnvironment env,
        ILogger<ProfileController> logger)
    {
        _userRepo = userRepo;
        _adminRepo = adminRepo;
        _reviewRepo = reviewRepo;
        _env = env;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            var username = User.Identity?.Name;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            
            if (string.IsNullOrEmpty(username))
                return Unauthorized(new { message = "Not authenticated" });

            if (role == "admin")
            {
                var admin = await _adminRepo.GetByUsernameAsync(username);
                if (admin == null) return NotFound(new { message = "Admin not found" });

                return Ok(new
                {
                    id = admin.Id,
                    username = admin.Username,
                    email = $"{admin.Username}@admin.discover.com",
                    profileImageUrl = admin.ProfileImageUrl,
                    createdAt = admin.CreatedAt,
                    role = "admin",
                    stats = new { saved = 0, reviews = 0, photos = 0, pendingReviews = 0 }
                });
            }

            var user = await _userRepo.GetByUsernameAsync(username);
            if (user == null) return NotFound(new { message = "User not found" });

            var allReviews = await _reviewRepo.GetByAttractionAsync(0);
            var userReviews = allReviews.Where(r => r.UserId == user.Id).ToList();
            var approvedReviews = userReviews.Where(r => r.Status == "approved").ToList();

            return Ok(new
            {
                id = user.Id,
                username = user.Username,
                email = user.Email,
                profileImageUrl = user.ProfileImageUrl,
                preferredLanguage = user.PreferredLanguage,
                createdAt = user.CreatedAt,
                role = "user",
                stats = new
                {
                    saved = 0,
                    reviews = approvedReviews.Count,
                    photos = 0,
                    pendingReviews = userReviews.Count(r => r.Status == "pending")
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetProfile");
            return StatusCode(500, new { message = "Error fetching profile" });
        }
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadProfileImage(IFormFile image)
    {
        try
        {
            var username = User.Identity?.Name;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(username))
                return Unauthorized();

            if (image == null || image.Length == 0)
                return BadRequest(new { message = "No image provided" });

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var ext = Path.GetExtension(image.FileName).ToLower();
            if (!allowedExtensions.Contains(ext))
                return BadRequest(new { message = "Only JPG, PNG, WEBP allowed" });

            if (image.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "Image must be under 5MB" });

            var webRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsPath = Path.Combine(webRootPath, "uploads", "profiles");
            
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var fileName = $"profile_{username}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}{ext}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await image.CopyToAsync(stream);

            var imageUrl = $"/uploads/profiles/{fileName}";

            if (role == "admin")
            {
                var admin = await _adminRepo.GetByUsernameAsync(username);
                if (admin == null) return NotFound(new { message = "Admin not found" });

                if (!string.IsNullOrEmpty(admin.ProfileImageUrl))
                {
                    var oldFile = Path.Combine(webRootPath, admin.ProfileImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldFile)) System.IO.File.Delete(oldFile);
                }

                admin.ProfileImageUrl = imageUrl;
                await _adminRepo.UpdateAsync(admin);
            }
            else
            {
                var user = await _userRepo.GetByUsernameAsync(username);
                if (user == null) return NotFound(new { message = "User not found" });

                if (!string.IsNullOrEmpty(user.ProfileImageUrl))
                {
                    var oldFile = Path.Combine(webRootPath, user.ProfileImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldFile)) System.IO.File.Delete(oldFile);
                }

                user.ProfileImageUrl = imageUrl;
                await _userRepo.UpdateAsync(user);
            }

            return Ok(new { imageUrl, message = "Profile image updated" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading profile image");
            return StatusCode(500, new { message = "Upload failed: " + ex.Message });
        }
    }

    [HttpGet("reviews")]
    public async Task<IActionResult> GetMyReviews()
    {
        try
        {
            var username = User.Identity?.Name;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(username)) return Unauthorized();
            if (role == "admin") return Ok(new object[0]);

            var user = await _userRepo.GetByUsernameAsync(username);
            if (user == null) return NotFound();

            var allReviews = await _reviewRepo.GetByAttractionAsync(0);
            var userReviews = allReviews
                .Where(r => r.UserId == user.Id)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id, r.Rating, r.Comment, r.Status, r.CreatedAt,
                    AttractionName = r.Attraction?.Name ?? "Unknown Place",
                    AttractionId = r.AttractionId
                });

            return Ok(userReviews);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching reviews");
            return StatusCode(500, new { message = "Error fetching reviews" });
        }
    }
}
