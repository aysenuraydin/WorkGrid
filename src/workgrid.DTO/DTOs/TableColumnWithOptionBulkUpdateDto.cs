namespace workgrid.DTO.DTOs;

public class TableColumnWithOptionBulkUpdateDto
{
    public long Id { get; set; }
    public List<ColumnUIConfigDto>? UiFk { get; set; } = new List<ColumnUIConfigDto>();
    public List<ColumnDataConfigDto>? DataFk { get; set; } = new List<ColumnDataConfigDto>();
}