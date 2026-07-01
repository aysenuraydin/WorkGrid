using workgrid.Domain.Common;
using workgrid.Domain.Events;
namespace workgrid.Domain.Entities;

public class MenuSnapshot
{
    public Guid Id { get; set; }

    public Guid? TenantId { get; set; }

    public string JsonData { get; set; } = "[]";

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public string? SavedBy { get; set; }
}