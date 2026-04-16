using Microsoft.AspNetCore.Authorization;
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
        var approvedReviews = reviews.Where(r => r.Status == "approved");
        return Ok(approvedReviews.Select(ToDto));
    }

    [HttpGet("pending")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetPending()
    {
        var reviews = await _reviewRepo.GetPendingAsync();
        return Ok(reviews.Select(ToDto));
    }

    [HttpGet("all")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetAll()
    {
        var reviews = await _reviewRepo.GetByAttractionAsync(0); // 0 means all
        return Ok(reviews.Select(ToDto));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
    {
        var attraction = await _attractionRepo.GetByIdAsync(dto.AttractionId);
        if (attraction == null) return BadRequest(new { message = "Place not found" });

        var username = User.Identity?.Name;
        var user = await _userRepo.GetByUsernameAsync(username);
        if (user == null) return Unauthorized();

        var review = new Review
        {
            Rating = dto.Rating,
            Comment = dto.Comment ?? "",
            AttractionId = dto.AttractionId,
            UserId = user.Id,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        var created = await _reviewRepo.CreateAsync(review);
        await _attractionRepo.UpdateRatingAsync(dto.AttractionId);
        return Ok(ToDto(created));
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var updated = await _reviewRepo.UpdateStatusAsync(id, status);
        if (updated == null) return NotFound();
        await _attractionRepo.UpdateRatingAsync(updated.AttractionId);
        return Ok(ToDto(updated));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _reviewRepo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    private static ReviewDto ToDto(Review r) => new(r.Id, r.Rating, r.Comment, r.Status, r.User?.Username ?? "User", r.AttractionId, r.Attraction?.Name ?? "", r.CreatedAt);
}
