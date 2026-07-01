namespace workgrid.Domain.Repositories;

public interface IClientItemRepository
{
    Task<List<ClientItem>> GetAllAsync(CancellationToken ct = default);
    Task<ClientItem?> GetByIdAsync(int id, CancellationToken ct = default);
    Task AddAsync(ClientItem entity, CancellationToken ct = default);
    Task DeleteAsync(ClientItem entity, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}