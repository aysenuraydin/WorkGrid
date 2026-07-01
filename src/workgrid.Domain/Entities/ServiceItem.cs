using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;



public class ServiceItem
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int ServiceSectionId { get; set; }
    public ServiceSection ServiceSection { get; set; } = null!;
}
