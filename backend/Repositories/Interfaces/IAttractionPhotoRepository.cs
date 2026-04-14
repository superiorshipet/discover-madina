using DiscoverMadina.Models;

namespace DiscoverMadina.Repositories.Interfaces;

public interface IAttractionPhotoRepository
{
    Task<List<AttractionPhoto>> GetByAttractionIdAsync(int attractionId);
    Task<AttractionPhoto?> GetByIdAsync(int id);
    Task<AttractionPhoto> AddAsync(AttractionPhoto photo);
    Task<List<AttractionPhoto>> AddMultipleAsync(List<AttractionPhoto> photos);
    Task<bool> DeleteAsync(int id);
    Task<bool> SetPrimaryAsync(int photoId, int attractionId);
    Task<bool> ReorderAsync(int attractionId, List<int> photoIds);
}