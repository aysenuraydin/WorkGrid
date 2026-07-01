using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;

public class AboutConfig
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
