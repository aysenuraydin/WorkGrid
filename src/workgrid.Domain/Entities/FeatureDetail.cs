using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;

public class FeatureDetail
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string? Value { get; set; }

    public int FeatureItemId { get; set; }
    public bool IsApproved { get; set; } = true;
    public FeatureItem? FeatureItem { get; set; }
}

