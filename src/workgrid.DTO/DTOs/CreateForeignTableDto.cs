
namespace workgrid.DTO.DTOs;

public class CreateForeignTableDto
{
    public long ForeignTableId { get; set; }
    public string CreateOrUpdateColumnId { get; set; }
    public string ListColumnIds { get; set; }
    public bool? IsMultiSelect { get; set; }
}
