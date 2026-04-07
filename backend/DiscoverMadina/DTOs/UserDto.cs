namespace DiscoverMadina.DTOs
{
    public class UserListDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PreferredLanguage { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }
}
