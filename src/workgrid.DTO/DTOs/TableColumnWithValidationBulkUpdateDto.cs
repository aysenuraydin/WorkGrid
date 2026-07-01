namespace workgrid.DTO.DTOs;

public class TableColumnWithValidationBulkUpdateDto
{
    public long Id { get; set; }
    public ColumnValidationConfigDto ValidationFk { get; set; } = new();
}