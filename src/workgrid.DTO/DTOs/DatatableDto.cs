
using workgrid.Domain.Enums;
namespace workgrid.DTO.DTOs;

public class DatatableDto
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public ModalSizeType? ModalSize { get; set; }
    public int? ModalHeight { get; set; }
    public TableViewType? ViewType { get; set; }
    public int? PageSize { get; set; }
    public List<ForeignTableDto>? ForeignTablesFk { get; set; }

    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? LastModifiedAt { get; set; }
    public string? LastModifiedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
}

