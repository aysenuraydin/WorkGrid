using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;


public class CompanyProjectRepository(WorkGridDbContext db) : ICompanyProjectRepository
{
    public Task<List<Work>> GetAllAsync(CancellationToken ct = default)
        => db.Works.ToListAsync(ct);

    public Task<Work?> GetByExternalIdAsync(string externalId, CancellationToken ct = default)
        => db.Works.FirstOrDefaultAsync(x => x.ExternalId == externalId, ct);

    public Task AddAsync(Work entity, CancellationToken ct = default)
    {
        db.Works.Add(entity);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Work entity, CancellationToken ct = default)
    {
        db.Works.Remove(entity);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
        => db.SaveChangesAsync(ct);
}

