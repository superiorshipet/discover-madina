using DiscoverMadina.DTOs;

namespace DiscoverMadina.DTOs;

public class AdminStatsDto
{
    public int TotalAttractions { get; set; }
    public int TotalUsers { get; set; }
    public int TotalReviews { get; set; }
    public int PendingReviews { get; set; }
    public List<AttractionDto> RecentAttractions { get; set; } = [];
}
