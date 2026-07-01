namespace workgrid.DTO.DTOs;

public class TableColumnWithCellsDto
{
    public long ColumnId { get; set; }
    public ICollection<TableCellDto> CellsFk { get; set; } = new List<TableCellDto>();

}