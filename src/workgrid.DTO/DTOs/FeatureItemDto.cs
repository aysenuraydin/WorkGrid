namespace workgrid.DTO.DTOs;

public record FeatureItemDto(
    int Id,
    string Title,
    string? SubTitle,
    string Description,
    string ImageUrl,
    string? IconUrl,
    int OrderNumber,
    bool IsRight,
    string BgColor,
    List<FeatureDetailDto> FeaturesDetails
);
