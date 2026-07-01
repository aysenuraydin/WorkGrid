using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;

public class FaqCategory
{
    public int Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;

    public ICollection<FaqQuestion> Questions { get; set; } = new List<FaqQuestion>();
}
