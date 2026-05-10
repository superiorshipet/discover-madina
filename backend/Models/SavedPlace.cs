using System.ComponentModel.DataAnnotations.Schema;

namespace DiscoverMadina.Models;

public class SavedPlace
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int AttractionId { get; set; }
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    [ForeignKey("AttractionId")]
    public Attraction Attraction { get; set; } = null!;
}
