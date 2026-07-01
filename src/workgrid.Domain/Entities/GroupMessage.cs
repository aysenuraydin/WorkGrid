namespace workgrid.Domain.Entities;

public class GroupMessage
{
    public Guid Id { get; set; }
    public Guid GroupId { get; set; }
    public string SenderId { get; set; } = null!;
    public string MessageText { get; set; } = null!;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public Group Group { get; set; } = null!;

    public string? AttachmentUrl { get; set; }
    public string? AttachmentType { get; set; }
    public string? AttachmentName { get; set; }
}