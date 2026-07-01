using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;

public class GalleryItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}