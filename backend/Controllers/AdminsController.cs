using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DiscoverMadina.DTOs;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;
using System.Security.Claims;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminsController : ControllerBase
{
    private readonly IAdminRepository _adminRepo;
    public AdminsController(IAdminRepository adminRepo) => _adminRepo = adminRepo;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var admins = await _adminRepo.GetAllAsync();
        return Ok(admins.Select(a => new AdminDto(a.Id, a.Username, a.Role, a.CreatedAt)));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAdminDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "Username and password required" });
        if (dto.Password.Length < 6)
            return BadRequest(new { message = "Password too short" });
        if (await _adminRepo.GetByUsernameAsync(dto.Username) != null)
            return Conflict(new { message = "Username exists" });

        var currentAdminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var admin = new Admin
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "admin",
            CreatedBy = currentAdminId != null ? int.Parse(currentAdminId) : null
        };
        var created = await _adminRepo.CreateAsync(admin);
        return Ok(new AdminDto(created.Id, created.Username, created.Role, created.CreatedAt));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (User.FindFirst(ClaimTypes.NameIdentifier)?.Value == id.ToString())
            return BadRequest(new { message = "Cannot delete yourself" });
        var deleted = await _adminRepo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
