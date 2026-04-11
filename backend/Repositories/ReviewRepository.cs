using Microsoft.EntityFrameworkCore;
using DiscoverMadina.Data;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;

namespace DiscoverMadina.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _db;
    public ReviewRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Review>> GetByAttractionAsync(int attractionId) =>
        await _db.Reviews.Include(r => r.User).Where(r => r.AttractionId == attractionId && r.Status == "approved")
            .OrderByDescending(r => r.CreatedAt).ToListAsync();

    public async Task<IEnumerable<Review>> GetPendingAsync() =>
        await _db.Reviews.Include(r => r.User).Include(r => r.Attraction)
            .Where(r => r.Status == "pending" || r.Status == "flagged")
            .OrderByDescending(r => r.CreatedAt).ToListAsync();

    public async Task<Review> CreateAsync(Review review)
    {
        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();
        return review;
    }

    public async Task<Review?> UpdateStatusAsync(int id, string status)
    {
        var review = await _db.Reviews.FindAsync(id);
        if (review == null) return null;
        review.Status = status;
        await _db.SaveChangesAsync();
        return review;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var r = await _db.Reviews.FindAsync(id);
        if (r == null) return false;
        _db.Reviews.Remove(r);
        await _db.SaveChangesAsync();
        return true;
    }
}
