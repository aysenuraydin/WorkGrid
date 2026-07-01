
namespace workgrid.DTO.DTOs;

public class ForeignTableDto
{
    public long Id { get; set; }
    public long DatatableId { get; set; }
    public long ForeignTableId { get; set; }
    public string ForeignTableName { get; set; } = null!;
    public string CreateOrUpdateColumnId { get; set; }
    public string ListColumnIds { get; set; }
    public string? SelectedRowIds { get; set; }
    public bool IsMultiSelect { get; set; }
}