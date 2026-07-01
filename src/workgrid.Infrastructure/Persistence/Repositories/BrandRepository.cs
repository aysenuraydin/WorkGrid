using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class BrandRepository(WorkGridDbContext db) : IBrandRepository
{
    public Task<BrandConfig?> GetAsync() =>
        db.BrandConfigs.FirstOrDefaultAsync();

    public async Task AddAsync(BrandConfig entity) =>
        await db.BrandConfigs.AddAsync(entity);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}