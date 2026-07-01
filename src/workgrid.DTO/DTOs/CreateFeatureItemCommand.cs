namespace workgrid.DTO.DTOs;

public record CreateFeatureItemCommand(
    string Title,
    string? SubTitle,
    string Description,
    string ImageUrl,
    string? IconUrl,
    int OrderNumber,
    bool IsRight,
    string BgColor,
    List<CreateFeatureDetailCommand> FeaturesDetails
);

