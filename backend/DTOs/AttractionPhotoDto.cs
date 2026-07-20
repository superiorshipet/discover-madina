namespace DiscoverMadina.DTOs;

public record AttractionPhotoDto(
    int Id,
    string ImageUrl,
    bool IsPrimary,
    int DisplayOrder
);

public record UploadPhotosRequest(
    List<IFormFile> Photos
);