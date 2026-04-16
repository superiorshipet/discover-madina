using DiscoverMadina.Models;

namespace DiscoverMadina.Repositories.Interfaces;

public interface IAttractionRepository
{
    Task<IEnumerable<Attraction>> GetAllAsync(string? category = null, string? search = null);
    Task<Attraction?> GetByIdAsync(int id);
    Task<IEnumerable<Attraction>> GetFeaturedAsync();
    Task<Attraction> CreateAsync(Attraction attraction);
    Task<Attraction?> UpdateAsync(int id, Attraction attraction);
    Task<bool> DeleteAsync(int id);
    Task UpdateRatingAsync(int attractionId);
}
