using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class AboutConfigRepository(WorkGridDbContext db) : IAboutConfigRepository
{
    public Task<AboutConfig?> GetAsync() =>
        db.AboutConfigs.FirstOrDefaultAsync();

    public async Task AddAsync(AboutConfig entity) =>
        await db.AboutConfigs.AddAsync(entity);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}
