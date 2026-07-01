using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;


public class HeroSliderImage
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int OrderNumber { get; set; }
    public int LandingHeroConfigId { get; set; }
}
