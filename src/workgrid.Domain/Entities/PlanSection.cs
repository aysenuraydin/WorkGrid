using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;

public class PlanSection
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string MonthlyDiscountLabel { get; set; } = string.Empty;

    public ICollection<PlanItem> Items { get; set; } = new List<PlanItem>();
}
