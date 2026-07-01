namespace workgrid.Domain.Entities;

public class ChannelMessage
{
    public Guid Id { get; set; }
    public Guid ChannelId { get; set; }
    public string SenderId { get; set; } = null!;
    public string MessageText { get; set; } = null!;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public Channel Channel { get; set; } = null!;

    public string? AttachmentUrl { get; set; }
    public string? AttachmentType { get; set; }
    public string? AttachmentName { get; set; }
}