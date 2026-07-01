using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class StatsSectionRepository(WorkGridDbContext db) : IStatsSectionRepository
{
    public Task<StatsSection?> GetAsync() =>
        db.StatsSections.FirstOrDefaultAsync();

    public async Task AddAsync(StatsSection entity) =>
        await db.StatsSections.AddAsync(entity);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}

