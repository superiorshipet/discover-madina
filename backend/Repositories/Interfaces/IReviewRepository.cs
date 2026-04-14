using DiscoverMadina.Models;

namespace DiscoverMadina.Repositories.Interfaces;

public interface IReviewRepository
{
    Task<List<Review>> GetByAttractionAsync(int attractionId);
    Task<List<Review>> GetPendingAsync();
    Task<Review?> GetByIdAsync(int id);
    Task<Review> CreateAsync(Review review);
    Task<Review?> UpdateStatusAsync(int id, string status);
    Task<bool> DeleteAsync(int id);
}