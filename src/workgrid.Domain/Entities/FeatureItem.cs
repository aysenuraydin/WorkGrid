using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;

public class FeatureItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? SubTitle { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? IconUrl { get; set; }
    public int OrderNumber { get; set; }
    public bool IsRight { get; set; }
    public string BgColor { get; set; } = "#ffffff";

    public ICollection<FeatureDetail> FeaturesDetails { get; set; } = new List<FeatureDetail>();
}
