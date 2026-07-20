namespace DiscoverMadina.Models;

public class AttractionPhoto
{
    public int Id { get; set; }
    public int AttractionId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPrimary { get; set; } // First photo shown as main
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public Attraction Attraction { get; set; } = null!;
}