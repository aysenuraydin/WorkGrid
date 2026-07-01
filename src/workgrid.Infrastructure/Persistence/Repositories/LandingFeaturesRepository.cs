using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;


public class LandingFeaturesRepository : ILandingFeaturesRepository
{
    private readonly WorkGridDbContext _context;

    public LandingFeaturesRepository(WorkGridDbContext context)
    {
        _context = context;
    }

    public Task<List<FeatureItem>> GetAllWithDetailsAsync(CancellationToken ct = default)
        => _context.FeatureItems
            .Include(f => f.FeaturesDetails)
            .OrderBy(f => f.OrderNumber)
            .ToListAsync(ct);

    public Task<FeatureItem?> GetByIdWithDetailsAsync(int id, CancellationToken ct = default)
        => _context.FeatureItems
            .Include(f => f.FeaturesDetails)
            .FirstOrDefaultAsync(f => f.Id == id, ct);

    public Task AddFeatureAsync(FeatureItem feature, CancellationToken ct = default)
    {
        _context.FeatureItems.Add(feature);
        return Task.CompletedTask;
    }

    public Task DeleteFeatureAsync(FeatureItem feature, CancellationToken ct = default)
    {
        _context.FeatureItems.Remove(feature);
        return Task.CompletedTask;
    }

    public Task<CtaConfig?> GetCtaConfigAsync(CancellationToken ct = default)
        => _context.CtaConfigs.FirstOrDefaultAsync(ct);

    public Task AddCtaConfigAsync(CtaConfig cta, CancellationToken ct = default)
    {
        _context.CtaConfigs.Add(cta);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
        => _context.SaveChangesAsync(ct);
}

