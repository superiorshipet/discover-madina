using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DiscoverMadina.Data;
using DiscoverMadina.Models;
using Microsoft.EntityFrameworkCore;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SavedPlacesController : ControllerBase
{
    private readonly AppDbContext _db;
    public SavedPlacesController(AppDbContext db) => _db = db;

    public class SavedPlace
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AttractionId { get; set; }
        public DateTime SavedAt { get; set; }
        public User User { get; set; } = null!;
        public Attraction Attraction { get; set; } = null!;
    }

    [HttpGet]
    public async Task<IActionResult> GetMySaved()
    {
        var username = User.Identity?.Name;
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return Unauthorized();

        var saved = await _db.Set<SavedPlace>()
            .Where(s => s.UserId == user.Id)
            .Include(s => s.Attraction)
            .Select(s => new { s.AttractionId, s.Attraction.Name, s.Attraction.NameEn, s.Attraction.Category, s.Attraction.Icon, s.SavedAt })
            .ToListAsync();
        return Ok(saved);
    }

    [HttpPost("{attractionId}")]
    public async Task<IActionResult> Save(int attractionId)
    {
        var username = User.Identity?.Name;
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return Unauthorized();

        var exists = await _db.Set<SavedPlace>().AnyAsync(s => s.UserId == user.Id && s.AttractionId == attractionId);
        if (!exists)
        {
            _db.Set<SavedPlace>().Add(new SavedPlace { UserId = user.Id, AttractionId = attractionId, SavedAt = DateTime.UtcNow });
            await _db.SaveChangesAsync();
        }
        return Ok(new { saved = true });
    }

    [HttpDelete("{attractionId}")]
    public async Task<IActionResult> Unsave(int attractionId)
    {
        var username = User.Identity?.Name;
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return Unauthorized();

        var saved = await _db.Set<SavedPlace>().FirstOrDefaultAsync(s => s.UserId == user.Id && s.AttractionId == attractionId);
        if (saved != null)
        {
            _db.Set<SavedPlace>().Remove(saved);
            await _db.SaveChangesAsync();
        }
        return Ok(new { saved = false });
    }
}
