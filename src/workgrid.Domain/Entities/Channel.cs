namespace workgrid.Domain.Entities;

public class Channel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string CreatedById { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ChannelMessage> Messages { get; set; } = new List<ChannelMessage>();
}