using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DiscoverMadina.Repositories.Interfaces;
using DiscoverMadina.Models;
using DiscoverMadina.DTOs;

namespace DiscoverMadina.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin,superadmin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepo;

        public UsersController(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserListDto>>> GetUsers()
        {
            var users = await _userRepo.GetAllAsync();
var dtos = users.Select(u => new UserListDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                PreferredLanguage = u.PreferredLanguage,
                CreatedAt = u.CreatedAt.ToString("yyyy-MM-dd HH:mm")
            }).ToList();
            return Ok(dtos);
        }
    }
}

public class UserListDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
}
