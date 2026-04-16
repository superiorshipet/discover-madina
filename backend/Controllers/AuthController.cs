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
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IUserRepository userRepo, 
        IAdminRepository adminRepo, 
        IConfiguration config,
        ILogger<AuthController> logger)
    {
        _userRepo = userRepo;
        _adminRepo = adminRepo;
        _config = config;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            _logger.LogInformation($"Register attempt for username: {dto.Username}, email: {dto.Email}");
            
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                _logger.LogWarning("Register failed: Missing required fields");
                return BadRequest(new { message = "All fields are required" });
            }

            if (dto.Password.Length < 6)
            {
                _logger.LogWarning("Register failed: Password too short");
                return BadRequest(new { message = "Password must be at least 6 characters" });
            }

            var existingEmail = await _userRepo.GetByEmailAsync(dto.Email);
            if (existingEmail != null)
            {
                _logger.LogWarning($"Register failed: Email {dto.Email} already in use");
                return Conflict(new { message = "Email already in use" });
            }

            var existingUsername = await _userRepo.GetByUsernameAsync(dto.Username);
            if (existingUsername != null)
            {
                _logger.LogWarning($"Register failed: Username {dto.Username} already taken");
                return Conflict(new { message = "Username already taken" });
            }

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                PreferredLanguage = dto.PreferredLanguage ?? "ar"
            };

            _logger.LogInformation($"Creating user: {user.Username}");
            var created = await _userRepo.CreateAsync(user);
            _logger.LogInformation($"User created successfully with ID: {created.Id}");
            
            var token = GenerateToken(created.Id.ToString(), created.Username, "user");
            
            return Ok(new AuthResponseDto(token, created.Username, "user"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Registration failed");
            return StatusCode(500, new { message = "Registration failed", error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
            _logger.LogInformation($"Login attempt for: {dto.Username}");
            
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Username and password required" });

            // Check Admin first
            var admin = await _adminRepo.GetByUsernameAsync(dto.Username);
            if (admin != null)
            {
                bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash);
                if (validPassword)
                {
                    _logger.LogInformation($"Admin login successful: {admin.Username}");
                    var token = GenerateToken(admin.Id.ToString(), admin.Username, admin.Role);
                    return Ok(new AuthResponseDto(token, admin.Username, admin.Role));
                }
            }

            // Check regular user
            var user = await _userRepo.GetByUsernameAsync(dto.Username);
            if (user == null)
                user = await _userRepo.GetByEmailAsync(dto.Username);

            if (user == null)
            {
                _logger.LogWarning($"Login failed: User {dto.Username} not found");
                return Unauthorized(new { message = "Invalid username or password" });
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                _logger.LogWarning($"Login failed: Invalid password for {user.Username}");
                return Unauthorized(new { message = "Invalid username or password" });
            }

            _logger.LogInformation($"User login successful: {user.Username}");
            var userToken = GenerateToken(user.Id.ToString(), user.Username, "user");
            return Ok(new AuthResponseDto(userToken, user.Username, "user"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login failed");
            return StatusCode(500, new { message = "Login failed", error = ex.Message });
        }
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
