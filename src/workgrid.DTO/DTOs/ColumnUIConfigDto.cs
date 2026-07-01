using workgrid.Domain.Enums;
namespace workgrid.DTO.DTOs;

public class ColumnUIConfigDto
{
    public long ColumnId { get; set; }
    public string? Value { get; set; } = null!;
    public AttributeEnum Type { get; set; }
};
