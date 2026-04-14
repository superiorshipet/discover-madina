using DiscoverMadina.Data;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DiscoverMadina.Repositories;

public class AttractionPhotoRepository : IAttractionPhotoRepository
{
    private readonly AppDbContext _context;

    public AttractionPhotoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AttractionPhoto>> GetByAttractionIdAsync(int attractionId)
    {
        return await _context.AttractionPhotos
            .Where(p => p.AttractionId == attractionId)
            .OrderByDescending(p => p.IsPrimary)
            .ThenBy(p => p.DisplayOrder)
            .ToListAsync();
    }

    public async Task<AttractionPhoto?> GetByIdAsync(int id)
    {
        return await _context.AttractionPhotos.FindAsync(id);
    }

    public async Task<AttractionPhoto> AddAsync(AttractionPhoto photo)
    {
        _context.AttractionPhotos.Add(photo);
        await _context.SaveChangesAsync();
        return photo;
    }

    public async Task<List<AttractionPhoto>> AddMultipleAsync(List<AttractionPhoto> photos)
    {
        _context.AttractionPhotos.AddRange(photos);
        await _context.SaveChangesAsync();
        return photos;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var photo = await _context.AttractionPhotos.FindAsync(id);
        if (photo == null) return false;
        
        _context.AttractionPhotos.Remove(photo);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetPrimaryAsync(int photoId, int attractionId)
    {
        var photos = await _context.AttractionPhotos
            .Where(p => p.AttractionId == attractionId)
            .ToListAsync();
            
        foreach (var p in photos)
        {
            p.IsPrimary = p.Id == photoId;
        }
        
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReorderAsync(int attractionId, List<int> photoIds)
    {
        var photos = await _context.AttractionPhotos
            .Where(p => p.AttractionId == attractionId)
            .ToListAsync();
            
        for (int i = 0; i < photoIds.Count; i++)
        {
            var photo = photos.FirstOrDefault(p => p.Id == photoIds[i]);
            if (photo != null)
            {
                photo.DisplayOrder = i;
            }
        }
        
        await _context.SaveChangesAsync();
        return true;
    }
}