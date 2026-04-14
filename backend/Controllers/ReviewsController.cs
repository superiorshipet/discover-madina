using Microsoft.AspNetCore.Mvc;
using DiscoverMadina.DTOs;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewRepository _reviewRepo;
    private readonly IAttractionRepository _attractionRepo;
    private readonly IUserRepository _userRepo;

    public ReviewsController(
        IReviewRepository reviewRepo, 
        IAttractionRepository attractionRepo,
        IUserRepository userRepo)
    {
        _reviewRepo = reviewRepo;
        _attractionRepo = attractionRepo;
        _userRepo = userRepo;
    }

    [HttpGet("attraction/{attractionId}")]
    public async Task<IActionResult> GetByAttraction(int attractionId)
    {
        var reviews = await _reviewRepo.GetByAttractionAsync(attractionId);
        
        // Only return approved reviews for public
        var isAdmin = User.IsInRole("admin") || User.IsInRole("superadmin");
        var filteredReviews = isAdmin 
            ? reviews 
            : reviews.Where(r => r.Status == "approved");
        
        return Ok(filteredReviews.Select(r => ToDto(r)));
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var reviews = await _reviewRepo.GetPendingAsync();
        return Ok(reviews.Select(r => ToDto(r)));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
    {
        // Validate attraction exists
        var attraction = await _attractionRepo.GetByIdAsync(dto.AttractionId);
        if (attraction == null)
            return BadRequest(new { message = "المكان غير موجود" });

        // Try to find user by username
        User? user = null;
        if (!string.IsNullOrEmpty(dto.Username))
        {
            user = await _userRepo.GetByUsernameAsync(dto.Username);
        }

        // If user not found, create a guest user or use a default "anonymous" user
        if (user == null)
        {
            // Option 1: Create a guest user
            user = await _userRepo.GetByUsernameAsync("guest");
            
            // Option 2: If no guest user exists, create one
            if (user == null)
            {
                user = new User
                {
                    Username = "guest",
                    Email = "guest@discover-madina.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("guest123"),
                    PreferredLanguage = "ar"
                };
                user = await _userRepo.CreateAsync(user);
            }
        }

        var review = new Review
        {
            Rating = dto.Rating,
            Comment = dto.Comment ?? string.Empty,
            AttractionId = dto.AttractionId,
            UserId = user.Id,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        var created = await _reviewRepo.CreateAsync(review);
        
        // Update attraction rating average
        await _attractionRepo.UpdateRatingAsync(dto.AttractionId);
        
        return Ok(ToDto(created));
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var updated = await _reviewRepo.UpdateStatusAsync(id, status);
        if (updated == null) return NotFound();
        
        await _attractionRepo.UpdateRatingAsync(updated.AttractionId);
        return Ok(ToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var review = await _reviewRepo.GetByIdAsync(id);
        if (review == null) return NotFound();
        
        var deleted = await _reviewRepo.DeleteAsync(id);
        if (deleted)
        {
            await _attractionRepo.UpdateRatingAsync(review.AttractionId);
        }
        return deleted ? NoContent() : NotFound();
    }

    private static ReviewDto ToDto(Review r)
    {
        return new ReviewDto(
            r.Id, 
            r.Rating, 
            r.Comment, 
            r.Status,
            r.User?.Username ?? "زائر",
            r.AttractionId, 
            r.Attraction?.Name ?? "",
            r.CreatedAt
        );
    }
}