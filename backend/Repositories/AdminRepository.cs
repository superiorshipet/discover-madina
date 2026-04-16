using DiscoverMadina.Data;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DiscoverMadina.Repositories;

public class AdminRepository : IAdminRepository
{
    private readonly AppDbContext _context;
    public AdminRepository(AppDbContext context) => _context = context;

    public async Task<Admin?> GetByIdAsync(int id) => await _context.Admins.FindAsync(id);
    public async Task<Admin?> GetByUsernameAsync(string username) => await _context.Admins.FirstOrDefaultAsync(a => a.Username == username);
    public async Task<List<Admin>> GetAllAsync() => await _context.Admins.OrderByDescending(a => a.CreatedAt).ToListAsync();
    
    public async Task<Admin> CreateAsync(Admin admin)
    {
        _context.Admins.Add(admin);
        await _context.SaveChangesAsync();
        return admin;
    }

    public async Task<Admin> UpdateAsync(Admin admin)
    {
        _context.Admins.Update(admin);
        await _context.SaveChangesAsync();
        return admin;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var admin = await _context.Admins.FindAsync(id);
        if (admin == null) return false;
        _context.Admins.Remove(admin);
        await _context.SaveChangesAsync();
        return true;
    }
}
