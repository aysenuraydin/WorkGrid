using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class ContactRepository(WorkGridDbContext db) : IContactRepository
{
    public Task<ContactConfig?> GetAsync() =>
        db.ContactConfigs.FirstOrDefaultAsync();

    public async Task AddAsync(ContactConfig entity) =>
        await db.ContactConfigs.AddAsync(entity);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}