
namespace workgrid.DTO.DTOs;

public class MenuItemDto
{
    public long Id { get; set; }
    public string Label { get; set; }
    public string? Link { get; set; }
    public string? Icon { get; set; }
    public bool Visible { get; set; }
    public bool IsHeader { get; set; }
    public int Order { get; set; }
    public long? ParentId { get; set; }
    public bool Locked { get; set; }
    public bool? IsAdmin { get; set; }

    public string BadgeName { get; set; } = null!;
    public string BadgeColor { get; set; } = null!;


    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? LastModifiedAt { get; set; }
    public string? LastModifiedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
}
