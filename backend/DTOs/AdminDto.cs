namespace DiscoverMadina.DTOs;

public record AdminDto(int Id, string Username, string Role, DateTime CreatedAt);
public record CreateAdminDto(string Username, string Password);