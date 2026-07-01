namespace workgrid.Domain.Entities;

public class Work
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
}
