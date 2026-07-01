using workgrid.Domain.Enums;
namespace workgrid.DTO.DTOs;

public class DeletedTableColumnsDto
{
    public long Id { get; set; }
    public InputTypeEnum Type { get; set; }
    public string Name { get; set; } = null!;
    public bool IsVisible { get; set; }
    public int TableOrder { get; set; }
    public bool? IsFilter { get; set; }
    public long TableId { get; set; }
    public long? RealColumnId { get; set; }
    public long? RealTableId { get; set; }
    public DateTime? DeletedAt { get; set; }
}
