
namespace workgrid.DTO.DTOs;

public class UpdateForeignTableDto
{
    public long Id { get; set; }
    public long DatatableId { get; set; }
    public long ForeignTableId { get; set; }
    public string CreateOrUpdateColumnId { get; set; }
    public string ListColumnIds { get; set; }
    public string? SelectedRowIds { get; set; }
    public bool IsMultiSelect { get; set; }
}