namespace workgrid.DTO.DTOs;

public record PlanSectionDto(
    string Title,
    string Description,
    string MonthlyDiscountLabel,
    List<PlanItemDto> Items
);
