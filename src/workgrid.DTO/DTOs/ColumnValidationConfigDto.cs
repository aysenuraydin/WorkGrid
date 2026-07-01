using workgrid.Domain.Enums;
namespace workgrid.DTO.DTOs;

public class ColumnValidationConfigDto
{
    public FieldTypeEnum Type { get; set; }
    public List<RulesValidationConfigDto> Rules { get; set; } = new();
}


