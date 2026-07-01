using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface ITenantConfigRepository
{
    Task<TenantConfig?> GetAsync(CancellationToken ct = default);
    Task<TenantConfig> AddAsync(TenantConfig config, CancellationToken ct = default);
    Task UpdateAsync(TenantConfig config, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}