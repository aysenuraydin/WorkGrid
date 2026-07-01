namespace workgrid.DTO.DTOs;

public record PlanItemDto(
    string Id,
    string Name,
    string SubTitle,
    string Icon,
    decimal PriceMonthly,
    decimal PriceAnnual,
    bool IsPopular,
    List<PlanFeatureDto> Features
);