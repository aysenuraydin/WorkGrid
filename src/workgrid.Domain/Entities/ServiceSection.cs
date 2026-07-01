namespace workgrid.Domain.Entities;

public class ServiceSection
{
    public int Id { get; set; }
    public string MainTitle { get; set; } = string.Empty;
    public string MainDescription { get; set; } = string.Empty;

    public ICollection<ServiceItem> Items { get; set; } = new List<ServiceItem>();
}
