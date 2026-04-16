using Microsoft.AspNetCore.Mvc;
using DiscoverMadina.DTOs;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttractionsController : ControllerBase
{
    private readonly IAttractionRepository _attractionRepo;
    private readonly IAttractionPhotoRepository _photoRepo;
    private readonly IWebHostEnvironment _env;

    public AttractionsController(
        IAttractionRepository attractionRepo,
        IAttractionPhotoRepository photoRepo,
        IWebHostEnvironment env)
    {
        _attractionRepo = attractionRepo;
        _photoRepo = photoRepo;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var attractions = await _attractionRepo.GetAllAsync();
        var dtos = new List<AttractionDto>();
        foreach (var a in attractions)
            dtos.Add(await ToDto(a));
        return Ok(dtos);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured()
    {
        var featured = await _attractionRepo.GetFeaturedAsync();
        var dtos = new List<AttractionDto>();
        foreach (var a in featured)
            dtos.Add(await ToDto(a));
        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var a = await _attractionRepo.GetByIdAsync(id);
        if (a is null) return NotFound();
        return Ok(await ToDto(a));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAttractionDto dto)
    {
        var attraction = new Attraction
        {
            Name = dto.Name, NameEn = dto.NameEn, Category = dto.Category,
            Icon = dto.Icon, Latitude = dto.Latitude, Longitude = dto.Longitude,
            OpeningHours = dto.OpeningHours, Description = dto.Description,
            IsFeatured = dto.IsFeatured
        };
        var created = await _attractionRepo.CreateAsync(attraction);
        return Ok(await ToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateAttractionDto dto)
    {
        var attraction = new Attraction
        {
            Name = dto.Name, NameEn = dto.NameEn, Category = dto.Category,
            Icon = dto.Icon, Latitude = dto.Latitude, Longitude = dto.Longitude,
            OpeningHours = dto.OpeningHours, Description = dto.Description,
            IsFeatured = dto.IsFeatured
        };
        var updated = await _attractionRepo.UpdateAsync(id, attraction);
        if (updated is null) return NotFound();
        return Ok(await ToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _attractionRepo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("{id}/photos")]
    public async Task<IActionResult> UploadPhotos(int id, [FromForm] List<IFormFile> photos)
    {
        var attraction = await _attractionRepo.GetByIdAsync(id);
        if (attraction == null) return NotFound();
        if (photos == null || photos.Count == 0 || photos.Count > 5)
            return BadRequest(new { error = "1-5 photos required" });

        var uploadsPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsPath);

        var uploadedPhotos = new List<AttractionPhoto>();
        var existingPhotos = await _photoRepo.GetByAttractionIdAsync(id);
        int nextOrder = existingPhotos.Any() ? existingPhotos.Max(p => p.DisplayOrder) + 1 : 0;

        foreach (var photo in photos)
        {
            var fileName = $"attraction_{id}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}_{Guid.NewGuid():N}.jpg";
            var filePath = Path.Combine(uploadsPath, fileName);
            using var stream = new FileStream(filePath, FileMode.Create);
            await photo.CopyToAsync(stream);

            uploadedPhotos.Add(new AttractionPhoto
            {
                AttractionId = id,
                ImageUrl = $"/uploads/{fileName}",
                IsPrimary = !existingPhotos.Any() && uploadedPhotos.Count == 1,
                DisplayOrder = nextOrder++
            });
        }

        await _photoRepo.AddMultipleAsync(uploadedPhotos);
        if (!existingPhotos.Any() && uploadedPhotos.Any())
        {
            attraction.ImageUrl = uploadedPhotos.First().ImageUrl;
            await _attractionRepo.UpdateAsync(id, attraction);
        }

        return Ok(uploadedPhotos.Select(p => new AttractionPhotoDto(p.Id, p.ImageUrl, p.IsPrimary, p.DisplayOrder)));
    }

    private async Task<AttractionDto> ToDto(Attraction a)
    {
        var photos = await _photoRepo.GetByAttractionIdAsync(a.Id);
        var photoDtos = photos.Select(p => new AttractionPhotoDto(p.Id, p.ImageUrl, p.IsPrimary, p.DisplayOrder)).ToList();
        return new AttractionDto(a.Id, a.Name, a.NameEn, a.Category, a.Icon, a.Latitude, a.Longitude, a.RatingAvg, a.OpeningHours, a.Description, a.ImageUrl, a.IsFeatured, photoDtos);
    }
}
