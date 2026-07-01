

using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface IDocumentRepository
{
    Task<Document?> GetAsync();
    Task AddAsync(Document entity);
    Task SaveChangesAsync();
}
