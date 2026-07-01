using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;

public class LandingHeroConfig
{
    public int Id { get; set; }

    public string Title { get; set; } = "Workgrid";

    public string Description { get; set; } = "Veri odaklı iş süreçlerinizi yönetin, potansiyelinizi açığa çıkarın.";

    public List<HeroSliderImage> SliderImages { get; set; } = new();


}
