using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DiscoverMadina.DTOs;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepo;
    private readonly IAdminRepository _adminRepo;
    private readonly IConfiguration _config;

    public AuthController(IUserRepository userRepo, IAdminRepository adminRepo, IConfiguration config)
    {
        _userRepo = userRepo;
        _adminRepo = adminRepo;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "All fields are required" });

        if (dto.Password.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters" });

        var existingEmail = await _userRepo.GetByEmailAsync(dto.Email);
        if (existingEmail != null)
            return Conflict(new { message = "Email already in use" });

        var existingUsername = await _userRepo.GetByUsernameAsync(dto.Username);
        if (existingUsername != null)
            return Conflict(new { message = "Username already taken" });

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            PreferredLanguage = dto.PreferredLanguage
        };

        await _userRepo.CreateAsync(user);
        var token = GenerateToken(user.Id.ToString(), user.Username, "user");
        return Ok(new AuthResponseDto(token, user.Username, "user"));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "Username and password required" });

        // Hardcoded admin for quick testing (remove after database is fixed)
        if (dto.Username == "admin" && dto.Password == "admin123")
        {
            var token = GenerateToken("1", "admin", "admin");
            return Ok(new AuthResponseDto(token, "admin", "admin"));
        }

        // Check Admin in database
        var admin = await _adminRepo.GetByUsernameAsync(dto.Username);
        if (admin != null)
        {
            try
            {
                if (BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash))
                {
                    var token = GenerateToken(admin.Id.ToString(), admin.Username, admin.Role);
                    return Ok(new AuthResponseDto(token, admin.Username, admin.Role));
                }
            }
            catch
            {
                return StatusCode(500, new { message = "Invalid stored password hash" });
            }
        }

        // Check regular user
        var user = await _userRepo.GetByUsernameAsync(dto.Username);
        if (user == null)
            user = await _userRepo.GetByEmailAsync(dto.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid username or password" });

        var userToken = GenerateToken(user.Id.ToString(), user.Username, "user");
        return Ok(new AuthResponseDto(userToken, user.Username, "user"));
    }

    [HttpGet("me")]
    public IActionResult Me()
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        if (string.IsNullOrEmpty(token)) return Unauthorized();

        try
        {
            var principal = ValidateToken(token);
            var username = principal.FindFirst(ClaimTypes.Name)?.Value;
            var role = principal.FindFirst(ClaimTypes.Role)?.Value;
            return Ok(new { username, role });
        }
        catch
        {
            return Unauthorized();
        }
    }

    private string GenerateToken(string userId, string username, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "DiscoverMadinaSecretKey2025!"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role)
        };
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "DiscoverMadina",
            audience: _config["Jwt:Audience"] ?? "DiscoverMadinaUsers",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private ClaimsPrincipal ValidateToken(string token)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "DiscoverMadinaSecretKey2025!"));
        var handler = new JwtSecurityTokenHandler();
        return handler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _config["Jwt:Issuer"] ?? "DiscoverMadina",
            ValidateAudience = true,
            ValidAudience = _config["Jwt:Audience"] ?? "DiscoverMadinaUsers",
            ValidateLifetime = true,
            IssuerSigningKey = key
        }, out _);
    }
}