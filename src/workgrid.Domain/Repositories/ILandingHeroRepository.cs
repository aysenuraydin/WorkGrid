using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface ILandingHeroRepository
{
    Task<LandingHeroConfig?> GetWithImagesAsync();
    Task<LandingHeroConfig> AddAsync(LandingHeroConfig config);
    Task SaveChangesAsync();
    void RemoveImages(IEnumerable<HeroSliderImage> images);
}
