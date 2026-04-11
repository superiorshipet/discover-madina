using Microsoft.EntityFrameworkCore;
using DiscoverMadina.Data;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;

namespace DiscoverMadina.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;
    public UserRepository(AppDbContext db) => _db = db;

    public async Task<User?> GetByIdAsync(int id) => await _db.Users.FindAsync(id);
    public async Task<User?> GetByEmailAsync(string email) => await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
    public async Task<User?> GetByUsernameAsync(string username) => await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
    public async Task<IEnumerable<User>> GetAllAsync() => await _db.Users.OrderByDescending(u => u.CreatedAt).ToListAsync();

    public async Task<User> CreateAsync(User user)
    {
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var u = await _db.Users.FindAsync(id);
        if (u == null) return false;
        _db.Users.Remove(u);
        await _db.SaveChangesAsync();
        return true;
    }
}
