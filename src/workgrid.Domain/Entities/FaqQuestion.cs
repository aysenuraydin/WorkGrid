using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;


public class FaqQuestion
{
    public int Id { get; set; }
    public string Q { get; set; } = string.Empty;
    public string A { get; set; } = string.Empty;

    public int FaqCategoryId { get; set; }
    public FaqCategory FaqCategory { get; set; } = null!;
}
