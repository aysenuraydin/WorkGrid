using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface ILandingFeaturesRepository
{
    Task<List<FeatureItem>> GetAllWithDetailsAsync(CancellationToken ct = default);
    Task<FeatureItem?> GetByIdWithDetailsAsync(int id, CancellationToken ct = default);
    Task AddFeatureAsync(FeatureItem feature, CancellationToken ct = default);
    Task DeleteFeatureAsync(FeatureItem feature, CancellationToken ct = default);

    Task<CtaConfig?> GetCtaConfigAsync(CancellationToken ct = default);
    Task AddCtaConfigAsync(CtaConfig cta, CancellationToken ct = default);

    Task SaveChangesAsync(CancellationToken ct = default);
}

