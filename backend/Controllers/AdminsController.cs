using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DiscoverMadina.DTOs;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;
using System.Security.Claims;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")] // Only admin can access
public class AdminsController : ControllerBase
{
    private readonly IAdminRepository _adminRepo;

    public AdminsController(IAdminRepository adminRepo)
    {
        _adminRepo = adminRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var admins = await _adminRepo.GetAllAsync();
        var dtos = admins.Select(a => new AdminDto(a.Id, a.Username, a.Role, a.CreatedAt));
        return Ok(dtos);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAdminDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "Username and password required" });

        if (dto.Password.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters" });

        var existing = await _adminRepo.GetByUsernameAsync(dto.Username);
        if (existing != null)
            return Conflict(new { message = "Username already exists" });

        var currentAdminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var admin = new Admin
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "admin", // Always admin now
            CreatedBy = currentAdminId != null ? int.Parse(currentAdminId) : null
        };

        var created = await _adminRepo.CreateAsync(admin);
        return Ok(new AdminDto(created.Id, created.Username, created.Role, created.CreatedAt));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var currentAdminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentAdminId == id.ToString())
            return BadRequest(new { message = "Cannot delete your own account" });

        var admin = await _adminRepo.GetByIdAsync(id);
        if (admin == null) return NotFound();

        var deleted = await _adminRepo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}