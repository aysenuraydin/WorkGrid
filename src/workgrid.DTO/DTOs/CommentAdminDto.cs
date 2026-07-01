using workgrid.Domain.Enums;

namespace workgrid.DTO.DTOs;

public class CommentAdminDto
{
    public long Id { get; set; }
    public string ItemId { get; set; } = null!;
    public CommentItemTypeEnum ItemType { get; set; }
    public string? ItemName { get; set; }
    public string UserId { get; set; } = null!;
    public string Content { get; set; } = null!;
    public int? Rating { get; set; }
    public long? ParentId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? AuthorName { get; set; }
    public string? AuthorAvatarUrl { get; set; }
    public List<string> Images { get; set; } = new();
}