namespace DiscoverMadina.DTOs;

public record AttractionDto(
    int Id, 
    string Name, 
    string NameEn, 
    string Category, 
    string Icon,
    decimal Latitude, 
    decimal Longitude, 
    float RatingAvg, 
    string OpeningHours,
    string Description, 
    string? ImageUrl, 
    bool IsFeatured,
    List<AttractionPhotoDto> Photos // Add this
);

public record CreateAttractionDto(
    string Name, 
    string NameEn, 
    string Category, 
    string Icon,
    decimal Latitude, 
    decimal Longitude, 
    string OpeningHours, 
    string Description,
    string? ImageUrl, 
    bool IsFeatured
);