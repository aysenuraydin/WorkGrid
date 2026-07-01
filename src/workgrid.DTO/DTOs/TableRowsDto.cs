namespace workgrid.DTO.DTOs;

public class TableRowsDto
{
    public long Id { get; set; }
    public ICollection<TableCellDto> CellsFk { get; set; } = new List<TableCellDto>();

    public long TableId { get; set; }     // FK

    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? LastModifiedAt { get; set; }
    public string? LastModifiedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
}



