using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DiscoverMadina.DTOs;
using DiscoverMadina.Models;
using DiscoverMadina.Repositories.Interfaces;
using System.Security.Claims;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "superadmin")]
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
            return BadRequest(new { message = "اسم المستخدم وكلمة المرور مطلوبان" });

        if (dto.Password.Length < 6)
            return BadRequest(new { message = "كلمة المرور 6 أحرف على الأقل" });

        var existing = await _adminRepo.GetByUsernameAsync(dto.Username);
        if (existing != null)
            return Conflict(new { message = "اسم المستخدم موجود بالفعل" });

        // Get current admin ID from token
        var currentAdminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var admin = new Admin
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role,
            CreatedBy = currentAdminId != null ? int.Parse(currentAdminId) : null
        };

        var created = await _adminRepo.CreateAsync(admin);
        return Ok(new AdminDto(created.Id, created.Username, created.Role, created.CreatedAt));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        // Don't allow deleting yourself
        var currentAdminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentAdminId == id.ToString())
            return BadRequest(new { message = "لا يمكن حذف حسابك الحالي" });

        var admin = await _adminRepo.GetByIdAsync(id);
        if (admin == null) return NotFound();
        
        // Don't allow deleting the last superadmin
        if (admin.Role == "superadmin")
        {
            var allAdmins = await _adminRepo.GetAllAsync();
            if (allAdmins.Count(a => a.Role == "superadmin") <= 1)
                return BadRequest(new { message = "لا يمكن حذف آخر مشرف عام" });
        }

        var deleted = await _adminRepo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPatch("{id}/password")]
    public async Task<IActionResult> UpdatePassword(int id, [FromBody] string newPassword)
    {
        if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 6)
            return BadRequest(new { message = "كلمة المرور 6 أحرف على الأقل" });

        var updated = await _adminRepo.UpdatePasswordAsync(id, BCrypt.Net.BCrypt.HashPassword(newPassword));
        return updated ? NoContent() : NotFound();
    }
}