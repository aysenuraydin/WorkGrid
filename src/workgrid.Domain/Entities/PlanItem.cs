using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;


public class PlanItem
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string SubTitle { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public decimal PriceMonthly { get; set; }
    public decimal PriceAnnual { get; set; }
    public bool IsPopular { get; set; }

    public int PlanSectionId { get; set; }
    public PlanSection PlanSection { get; set; } = null!;

    public ICollection<PlanFeature> Features { get; set; } = new List<PlanFeature>();
}
