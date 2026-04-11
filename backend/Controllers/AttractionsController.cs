using Microsoft.AspNetCore.Mvc;
using DiscoverMadina.DTOs;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;
using DiscoverMadina.Data;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttractionsController : ControllerBase
{
    private readonly IAttractionRepository _repo;
    private readonly IWebHostEnvironment _env;

    public AttractionsController(IAttractionRepository repo, IWebHostEnvironment env, IUserRepository userRepo, IReviewRepository reviewRepo)
    {
        _repo = repo;
        _env = env;
        _userRepo = userRepo;
        _reviewRepo = reviewRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category, [FromQuery] string? search)
    {
        var attractions = await _repo.GetAllAsync(category, search);
        return Ok(attractions.Select(ToDto));
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured()
    {
        var featured = await _repo.GetFeaturedAsync();
        return Ok(featured.Select(ToDto));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var a = await _repo.GetByIdAsync(id);
        return a is null ? NotFound() : Ok(ToDto(a));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAttractionDto dto)
    {
        var attraction = new Attraction
        {
            Name = dto.Name, NameEn = dto.NameEn, Category = dto.Category,
            Icon = dto.Icon, Latitude = dto.Latitude, Longitude = dto.Longitude,
            OpeningHours = dto.OpeningHours, Description = dto.Description,
            ImageUrl = dto.ImageUrl, IsFeatured = dto.IsFeatured
        };
        var created = await _repo.CreateAsync(attraction);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateAttractionDto dto)
    {
        var attraction = new Attraction
        {
            Name = dto.Name, NameEn = dto.NameEn, Category = dto.Category,
            Icon = dto.Icon, Latitude = dto.Latitude, Longitude = dto.Longitude,
            OpeningHours = dto.OpeningHours, Description = dto.Description,
            ImageUrl = dto.ImageUrl, IsFeatured = dto.IsFeatured
        };
        var updated = await _repo.UpdateAsync(id, attraction);
        return updated is null ? NotFound() : Ok(ToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _repo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    // ── IMAGE UPLOAD ──────────────────────────────
    [HttpPost("{id}/image")]
    public async Task<IActionResult> UploadImage(int id, IFormFile image)
    {
        var attraction = await _repo.GetByIdAsync(id);
        if (attraction == null) return NotFound();

        if (image == null || image.Length == 0)
            return BadRequest(new { error = "No image provided" });

        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(image.FileName).ToLower();
        if (!allowed.Contains(ext))
            return BadRequest(new { error = "Only jpg, png, webp allowed" });

        if (image.Length > 5 * 1024 * 1024)
            return BadRequest(new { error = "Image must be under 5MB" });

        // Save to wwwroot/uploads/
        var uploadsPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsPath);

        // Delete old image if exists
        if (!string.IsNullOrEmpty(attraction.ImageUrl))
        {
            var oldFile = Path.Combine(_env.WebRootPath ?? "wwwroot", attraction.ImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(oldFile)) System.IO.File.Delete(oldFile);
        }

        var fileName = $"attraction_{id}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}{ext}";
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
            await image.CopyToAsync(stream);

        var imageUrl = $"/uploads/{fileName}";
        attraction.ImageUrl = imageUrl;
        await _repo.UpdateAsync(id, attraction);

        return Ok(new { imageUrl });
    }

    private readonly IUserRepository _userRepo;
    private readonly IReviewRepository _reviewRepo;

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalAtt = await _repo.GetAllAsync();
        var recent = totalAtt.Take(5).ToList();
        var users = await _userRepo.GetAllAsync();
        var allReviews = await _reviewRepo.GetByAttractionAsync(0); // all
        var pending = await _reviewRepo.GetPendingAsync();
        
        return Ok(new {
            totalAttractions = totalAtt.Count(),
            totalUsers = users.Count(),
            totalReviews = allReviews.Count(),
            pendingReviews = pending.Count(),
            recentAttractions = recent.Select(ToDto).ToList()
        });
    }

    private static AttractionDto ToDto(Attraction a) =>
        new(a.Id, a.Name, a.NameEn, a.Category, a.Icon,
            a.Latitude, a.Longitude, a.RatingAvg, a.OpeningHours,
            a.Description, a.ImageUrl, a.IsFeatured);
}
