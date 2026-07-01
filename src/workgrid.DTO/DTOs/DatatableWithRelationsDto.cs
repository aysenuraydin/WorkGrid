
using workgrid.Domain.Enums;
namespace workgrid.DTO.DTOs;

public class DatatableWithRelationsDto
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public int? ModalHeight { get; set; }
    public ModalSizeType? ModalSize { get; set; }
    public TableViewType? ViewType { get; set; }
    public int? PageSize { get; set; }

    public ICollection<TableWithRelationsColumnDto> ColumnsFk { get; set; } = new List<TableWithRelationsColumnDto>();
    public List<ForeignTableDto>? ForeignTablesFk { get; set; }
}