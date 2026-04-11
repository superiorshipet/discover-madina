using Microsoft.EntityFrameworkCore;
using DiscoverMadina.Data;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;

namespace DiscoverMadina.Repositories;

public class AttractionRepository : IAttractionRepository
{
    private readonly AppDbContext _db;
    public AttractionRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Attraction>> GetAllAsync(string? category = null, string? search = null)
    {
        var q = _db.Attractions.AsQueryable();
        if (!string.IsNullOrEmpty(category) && category != "all")
            q = q.Where(a => a.Category == category);
        if (!string.IsNullOrEmpty(search))
            q = q.Where(a => a.Name.Contains(search) || a.NameEn.Contains(search));
        return await q.OrderByDescending(a => a.RatingAvg).ToListAsync();
    }

    public async Task<Attraction?> GetByIdAsync(int id) =>
        await _db.Attractions.Include(a => a.Reviews).ThenInclude(r => r.User).FirstOrDefaultAsync(a => a.Id == id);

    public async Task<IEnumerable<Attraction>> GetFeaturedAsync() =>
        await _db.Attractions.Where(a => a.IsFeatured).OrderByDescending(a => a.RatingAvg).Take(6).ToListAsync();

    public async Task<Attraction> CreateAsync(Attraction attraction)
    {
        _db.Attractions.Add(attraction);
        await _db.SaveChangesAsync();
        return attraction;
    }

    public async Task<Attraction?> UpdateAsync(int id, Attraction updated)
    {
        var existing = await _db.Attractions.FindAsync(id);
        if (existing == null) return null;
        existing.Name = updated.Name;
        existing.NameEn = updated.NameEn;
        existing.Category = updated.Category;
        existing.Latitude = updated.Latitude;
        existing.Longitude = updated.Longitude;
        existing.OpeningHours = updated.OpeningHours;
        existing.Description = updated.Description;
        existing.ImageUrl = updated.ImageUrl;
        existing.IsFeatured = updated.IsFeatured;
        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var a = await _db.Attractions.FindAsync(id);
        if (a == null) return false;
        _db.Attractions.Remove(a);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task UpdateRatingAsync(int attractionId)
    {
        var attraction = await _db.Attractions.Include(a => a.Reviews).FirstOrDefaultAsync(a => a.Id == attractionId);
        if (attraction == null) return;
        var approved = attraction.Reviews.Where(r => r.Status == "approved").ToList();
        attraction.RatingAvg = approved.Any() ? (float)approved.Average(r => r.Rating) : 0f;
        await _db.SaveChangesAsync();
    }
}
