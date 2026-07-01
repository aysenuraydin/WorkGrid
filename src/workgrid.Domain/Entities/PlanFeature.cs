using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;

public class PlanFeature
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsIncluded { get; set; }

    public int PlanItemId { get; set; }
    public PlanItem PlanItem { get; set; } = null!;
}
