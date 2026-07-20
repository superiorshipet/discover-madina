using DiscoverMadina.Data;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DiscoverMadina.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _context;

    public ReviewRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Review>> GetByAttractionAsync(int attractionId)
    {
        if (attractionId == 0)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Attraction)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }
        
        return await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Attraction)
            .Where(r => r.AttractionId == attractionId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Review>> GetPendingAsync()
    {
        return await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Attraction)
            .Where(r => r.Status == "pending")
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Review?> GetByIdAsync(int id)
    {
        return await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Attraction)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Review> CreateAsync(Review review)
    {
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<Review?> UpdateStatusAsync(int id, string status)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return null;
        
        review.Status = status;
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return false;
        
        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return true;
    }
}