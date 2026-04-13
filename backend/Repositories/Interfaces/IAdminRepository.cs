using DiscoverMadina.Models;

namespace DiscoverMadina.Repositories.Interfaces;

public interface IAdminRepository
{
    Task<Admin?> GetByIdAsync(int id);
    Task<Admin?> GetByUsernameAsync(string username);
    Task<List<Admin>> GetAllAsync();
    Task<Admin> CreateAsync(Admin admin);
    Task<bool> DeleteAsync(int id);
    Task<bool> UpdatePasswordAsync(int id, string passwordHash);
}