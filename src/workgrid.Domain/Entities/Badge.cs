using workgrid.Domain.Common;
namespace workgrid.Domain.Entities;

public class Badge : BaseAuditableEntity<long>
{
    public string Name { get; set; } = null!;
    public string Color { get; set; } = null!;

    public long? MenuItemId { get; set; }
    public MenuItem? MenuItemFk { get; set; }
}