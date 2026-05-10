using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DiscoverMadina.Data;
using DiscoverMadina.Models;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SavedPlacesController : ControllerBase
{
    private readonly AppDbContext _db;
    
    public SavedPlacesController(AppDbContext db) { _db = db; }

    [HttpPost("{attractionId}")]
    public async Task<IActionResult> SavePlace(int attractionId)
    {
        var username = User.Identity?.Name;
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return Unauthorized();

        var exists = await _db.SavedPlaces.AnyAsync(s => s.UserId == user.Id && s.AttractionId == attractionId);
        if (exists) return Conflict(new { message = "Already saved" });

        _db.SavedPlaces.Add(new SavedPlace { UserId = user.Id, AttractionId = attractionId, SavedAt = DateTime.UtcNow });
        await _db.SaveChangesAsync();
        return Ok(new { saved = true });
    }

    [HttpGet("check/{attractionId}")]
    public async Task<IActionResult> CheckSaved(int attractionId)
    {
        var username = User.Identity?.Name;
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return Unauthorized();

        var saved = await _db.SavedPlaces.AnyAsync(s => s.UserId == user.Id && s.AttractionId == attractionId);
        return Ok(new { saved });
    }

    [HttpGet]
    public async Task<IActionResult> GetMySaved()
    {
        var username = User.Identity?.Name;
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return Unauthorized();

        var saved = await _db.SavedPlaces
            .Where(s => s.UserId == user.Id)
            .Include(s => s.Attraction)
            .Select(s => new { s.AttractionId, s.Attraction.Name, s.Attraction.Icon, s.Attraction.Category, s.SavedAt })
            .ToListAsync();
        return Ok(saved);
    }

    [HttpDelete("{attractionId}")]
    public async Task<IActionResult> Unsave(int attractionId)
    {
        var username = User.Identity?.Name;
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return Unauthorized();

        var saved = await _db.SavedPlaces.FirstOrDefaultAsync(s => s.UserId == user.Id && s.AttractionId == attractionId);
        if (saved == null) return NotFound();

        _db.SavedPlaces.Remove(saved);
        await _db.SaveChangesAsync();
        return Ok(new { saved = false });
    }
}
