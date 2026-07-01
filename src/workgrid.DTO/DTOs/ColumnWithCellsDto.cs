
using workgrid.Domain.Enums;
namespace workgrid.DTO.DTOs;

public class ColumnWithCellsDto
{
    public long Id { get; set; }
    public InputTypeEnum Type { get; set; }
    public string Name { get; set; } = null!;
    public bool IsVisible { get; set; }
    public int TableOrder { get; set; }
    public bool? IsFilter { get; set; }
    public long TableId { get; set; }
    public List<TableCellDto> CellsFk { get; set; } = new List<TableCellDto>();
}
