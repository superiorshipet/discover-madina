namespace DiscoverMadina.DTOs;

public record LoginDto(string Username, string Password);
public record RegisterDto(string Username, string Email, string Password, string PreferredLanguage = "ar");
public record AuthResponseDto(string Token, string Username, string Role);