using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DiscoverMadina.Repositories.Interfaces;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepo;
    public UsersController(IUserRepository userRepo) => _userRepo = userRepo;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userRepo.GetAllAsync();
        return Ok(users.Select(u => new { u.Id, u.Username, u.Email, u.PreferredLanguage, CreatedAt = u.CreatedAt.ToString("yyyy-MM-dd") }));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _userRepo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
