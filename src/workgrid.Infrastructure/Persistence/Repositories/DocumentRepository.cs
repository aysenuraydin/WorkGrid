

using Microsoft.EntityFrameworkCore;
using workgrid.Infrastructure.Persistence;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

public class DocumentRepository(WorkGridDbContext db) : IDocumentRepository
{
    public Task<Document?> GetAsync() =>
        db.Documents.FirstOrDefaultAsync();

    public async Task AddAsync(Document entity) =>
        await db.Documents.AddAsync(entity);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}
