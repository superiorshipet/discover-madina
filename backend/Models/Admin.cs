namespace DiscoverMadina.Models;

public class Admin
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "admin"; // "admin" or "superadmin"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int? CreatedBy { get; set; } // Admin ID who created this admin
}   