using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;


public class ClientItemRepository(WorkGridDbContext db) : IClientItemRepository
{
    public Task<List<ClientItem>> GetAllAsync(CancellationToken ct = default)
        => db.ClientItems.ToListAsync(ct);

    public Task<ClientItem?> GetByIdAsync(int id, CancellationToken ct = default)
        => db.ClientItems.FirstOrDefaultAsync(x => x.Id == id, ct);

    public Task AddAsync(ClientItem entity, CancellationToken ct = default)
    {
        db.ClientItems.Add(entity);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(ClientItem entity, CancellationToken ct = default)
    {
        db.ClientItems.Remove(entity);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
        => db.SaveChangesAsync(ct);
}
