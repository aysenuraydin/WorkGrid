using workgrid.Domain.Enums;
namespace workgrid.DTO.DTOs;

public class ColumnDataConfigDto
{
    public long ColumnId { get; set; }
    public string? Value { get; set; } = null!;
    public PropertyEnum Type { get; set; }
};