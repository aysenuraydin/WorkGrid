using workgrid.Domain.Enums;
namespace workgrid.DTO.DTOs;

public class TableColumnBulkUpdateDto
{
    public long Id { get; set; }
    public int TableOrder { get; set; }
    public bool IsVisible { get; set; }
    public bool IsFilter { get; set; }
    public string Name { get; set; } = null!;
    public InputTypeEnum Type { get; set; }
}
