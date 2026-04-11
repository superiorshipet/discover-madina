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

    public ReviewsController(IReviewRepository reviewRepo, IAttractionRepository attractionRepo)
    {
        _reviewRepo = reviewRepo;
        _attractionRepo = attractionRepo;
    }

    [HttpGet("attraction/{attractionId}")]
    public async Task<IActionResult> GetByAttraction(int attractionId)
    {
        var reviews = await _reviewRepo.GetByAttractionAsync(attractionId);
        return Ok(reviews.Select(r => ToDto(r)));
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
        var review = new Review
        {
            Rating = dto.Rating, Comment = dto.Comment,
            AttractionId = dto.AttractionId, UserId = dto.UserId,
            Status = "pending"
        };
        var created = await _reviewRepo.CreateAsync(review);
        return CreatedAtAction(nameof(GetByAttraction), new { attractionId = dto.AttractionId }, ToDto(created));
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
        var deleted = await _reviewRepo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    private static ReviewDto ToDto(Review r) =>
        new(r.Id, r.Rating, r.Comment, r.Status,
            r.User?.Username ?? "anonymous",
            r.AttractionId, r.Attraction?.Name ?? "",
            r.CreatedAt);
}
