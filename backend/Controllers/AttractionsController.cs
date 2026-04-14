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
    private readonly IUserRepository _userRepo;
    private readonly IReviewRepository _reviewRepo;
    private readonly IWebHostEnvironment _env;

    public AttractionsController(
        IAttractionRepository attractionRepo,
        IAttractionPhotoRepository photoRepo,
        IUserRepository userRepo,
        IReviewRepository reviewRepo,
        IWebHostEnvironment env)
    {
        _attractionRepo = attractionRepo;
        _photoRepo = photoRepo;
        _userRepo = userRepo;
        _reviewRepo = reviewRepo;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category, [FromQuery] string? search)
    {
        var attractions = await _attractionRepo.GetAllAsync(category, search);
        var dtos = new List<AttractionDto>();
        foreach (var a in attractions)
        {
            dtos.Add(await ToDto(a));
        }
        return Ok(dtos);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured()
    {
        var featured = await _attractionRepo.GetFeaturedAsync();
        var dtos = new List<AttractionDto>();
        foreach (var a in featured)
        {
            dtos.Add(await ToDto(a));
        }
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
            Name = dto.Name,
            NameEn = dto.NameEn,
            Category = dto.Category,
            Icon = dto.Icon,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            OpeningHours = dto.OpeningHours,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            IsFeatured = dto.IsFeatured
        };
        var created = await _attractionRepo.CreateAsync(attraction);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, await ToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateAttractionDto dto)
    {
        var attraction = new Attraction
        {
            Name = dto.Name,
            NameEn = dto.NameEn,
            Category = dto.Category,
            Icon = dto.Icon,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            OpeningHours = dto.OpeningHours,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
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

    // Single image upload (backward compatibility)
    [HttpPost("{id}/image")]
    public async Task<IActionResult> UploadImage(int id, IFormFile image)
    {
        var attraction = await _attractionRepo.GetByIdAsync(id);
        if (attraction == null) return NotFound();

        if (image == null || image.Length == 0)
            return BadRequest(new { error = "No image provided" });

        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(image.FileName).ToLower();
        if (!allowed.Contains(ext))
            return BadRequest(new { error = "Only jpg, png, webp allowed" });

        if (image.Length > 5 * 1024 * 1024)
            return BadRequest(new { error = "Image must be under 5MB" });

        var uploadsPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsPath);

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
        await _attractionRepo.UpdateAsync(id, attraction);

        return Ok(new { imageUrl });
    }

    // Multiple photos upload
    [HttpPost("{id}/photos")]
    public async Task<IActionResult> UploadPhotos(int id, [FromForm] List<IFormFile> photos)
    {
        var attraction = await _attractionRepo.GetByIdAsync(id);
        if (attraction == null) return NotFound();

        if (photos == null || photos.Count == 0)
            return BadRequest(new { error = "No photos provided" });

        if (photos.Count > 5)
            return BadRequest(new { error = "Maximum 5 photos allowed" });

        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var uploadsPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsPath);

        var uploadedPhotos = new List<AttractionPhoto>();
        var existingPhotos = await _photoRepo.GetByAttractionIdAsync(id);
        int nextOrder = existingPhotos.Any() ? existingPhotos.Max(p => p.DisplayOrder) + 1 : 0;

        foreach (var photo in photos)
        {
            var ext = Path.GetExtension(photo.FileName).ToLower();
            if (!allowed.Contains(ext))
                return BadRequest(new { error = "Only jpg, png, webp allowed" });

            if (photo.Length > 5 * 1024 * 1024)
                return BadRequest(new { error = "Each photo must be under 5MB" });

            var fileName = $"attraction_{id}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}_{Guid.NewGuid():N}{ext}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await photo.CopyToAsync(stream);

            var attractionPhoto = new AttractionPhoto
            {
                AttractionId = id,
                ImageUrl = $"/uploads/{fileName}",
                IsPrimary = !existingPhotos.Any() && uploadedPhotos.Count == 0,
                DisplayOrder = nextOrder++
            };

            uploadedPhotos.Add(attractionPhoto);
        }

        await _photoRepo.AddMultipleAsync(uploadedPhotos);

        if (!existingPhotos.Any() && uploadedPhotos.Any())
        {
            attraction.ImageUrl = uploadedPhotos.First().ImageUrl;
            await _attractionRepo.UpdateAsync(id, attraction);
        }

        var photoDtos = uploadedPhotos.Select(p => new AttractionPhotoDto(
            p.Id, p.ImageUrl, p.IsPrimary, p.DisplayOrder
        ));
        
        return Ok(photoDtos);
    }

    // Delete a photo
    [HttpDelete("photos/{photoId}")]
    public async Task<IActionResult> DeletePhoto(int photoId)
    {
        var photo = await _photoRepo.GetByIdAsync(photoId);
        if (photo == null) return NotFound();

        var filePath = Path.Combine(_env.WebRootPath ?? "wwwroot", photo.ImageUrl.TrimStart('/'));
        if (System.IO.File.Exists(filePath))
            System.IO.File.Delete(filePath);

        await _photoRepo.DeleteAsync(photoId);

        var attraction = await _attractionRepo.GetByIdAsync(photo.AttractionId);
        if (attraction != null)
        {
            var remainingPhotos = await _photoRepo.GetByAttractionIdAsync(photo.AttractionId);
            if (remainingPhotos.Any())
            {
                var newPrimary = remainingPhotos.First();
                newPrimary.IsPrimary = true;
                await _photoRepo.SetPrimaryAsync(newPrimary.Id, photo.AttractionId);
                attraction.ImageUrl = newPrimary.ImageUrl;
            }
            else
            {
                attraction.ImageUrl = null;
            }
            await _attractionRepo.UpdateAsync(photo.AttractionId, attraction);
        }

        return NoContent();
    }

    // Set photo as primary
    [HttpPatch("photos/{photoId}/primary")]
    public async Task<IActionResult> SetPrimary(int photoId)
    {
        var photo = await _photoRepo.GetByIdAsync(photoId);
        if (photo == null) return NotFound();

        await _photoRepo.SetPrimaryAsync(photoId, photo.AttractionId);

        var attraction = await _attractionRepo.GetByIdAsync(photo.AttractionId);
        if (attraction != null)
        {
            attraction.ImageUrl = photo.ImageUrl;
            await _attractionRepo.UpdateAsync(photo.AttractionId, attraction);
        }

        return NoContent();
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalAtt = await _attractionRepo.GetAllAsync();
        var recent = totalAtt.Take(5).ToList();
        var users = await _userRepo.GetAllAsync();
        var allReviews = await _reviewRepo.GetByAttractionAsync(0);
        var pending = await _reviewRepo.GetPendingAsync();

        var recentDtos = new List<AttractionDto>();
        foreach (var a in recent)
        {
            recentDtos.Add(await ToDto(a));
        }

        return Ok(new
        {
            totalAttractions = totalAtt.Count(),
            totalUsers = users.Count(),
            totalReviews = allReviews.Count(),
            pendingReviews = pending.Count(),
            recentAttractions = recentDtos
        });
    }

    private async Task<AttractionDto> ToDto(Attraction a)
    {
        var photos = await _photoRepo.GetByAttractionIdAsync(a.Id);
        var photoDtos = photos.Select(p => new AttractionPhotoDto(
            p.Id, p.ImageUrl, p.IsPrimary, p.DisplayOrder
        )).ToList();

        return new AttractionDto(
            a.Id, a.Name, a.NameEn, a.Category, a.Icon,
            a.Latitude, a.Longitude, a.RatingAvg, a.OpeningHours,
            a.Description, a.ImageUrl, a.IsFeatured, photoDtos
        );
    }
}