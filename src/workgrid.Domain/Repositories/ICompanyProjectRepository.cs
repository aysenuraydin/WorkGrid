using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface ICompanyProjectRepository
{
    Task<List<Work>> GetAllAsync(CancellationToken ct = default);
    Task<Work?> GetByExternalIdAsync(string externalId, CancellationToken ct = default);
    Task AddAsync(Work entity, CancellationToken ct = default);
    Task DeleteAsync(Work entity, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

