namespace DiscoverMadina.DTOs;

public record ReviewDto(int Id, int Rating, string Comment, string Status,
    string Username, int AttractionId, string AttractionName, DateTime CreatedAt);

public record CreateReviewDto(int Rating, string Comment, int AttractionId, int UserId);
