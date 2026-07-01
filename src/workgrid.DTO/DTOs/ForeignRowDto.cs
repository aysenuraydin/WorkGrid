namespace workgrid.DTO.DTOs;

public class ForeignRowDto
{
    public long RowId { get; set; }
    public ICollection<TableCellDto> CellsFk { get; set; } = new List<TableCellDto>();
}

public class ForeignTableGroupDto
{
    public long Id { get; set; }
    public ICollection<ForeignRowDto> RowsFk { get; set; } = new List<ForeignRowDto>();
}

