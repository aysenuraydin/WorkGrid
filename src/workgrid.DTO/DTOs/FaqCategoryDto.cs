namespace workgrid.DTO.DTOs;

public record FaqCategoryDto(
    int Id,
    string Category,
    string Icon,
    List<FaqQuestionDto> Questions
);
