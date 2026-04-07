using DiscoverMadina.Models;

namespace DiscoverMadina.Repositories.Interfaces;

public interface IReviewRepository
{
    Task<IEnumerable<Review>> GetByAttractionAsync(int attractionId);
    Task<IEnumerable<Review>> GetPendingAsync();
    Task<Review> CreateAsync(Review review);
    Task<Review?> UpdateStatusAsync(int id, string status);
    Task<bool> DeleteAsync(int id);
}
