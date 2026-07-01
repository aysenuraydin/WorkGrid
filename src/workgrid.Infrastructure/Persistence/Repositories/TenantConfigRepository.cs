using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class TenantConfigRepository : ITenantConfigRepository
{
    private readonly WorkGridDbContext _context;

    public TenantConfigRepository(WorkGridDbContext context)
    {
        _context = context;
    }

    public Task<TenantConfig?> GetAsync(CancellationToken ct = default)
        => _context.Set<TenantConfig>().SingleOrDefaultAsync(ct);

    public async Task<TenantConfig> AddAsync(TenantConfig config, CancellationToken ct = default)
    {
        _context.Set<TenantConfig>().Add(config);
        return config;
    }

    public Task UpdateAsync(TenantConfig config, CancellationToken ct = default)
    {
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
        => _context.SaveChangesAsync(ct);
}