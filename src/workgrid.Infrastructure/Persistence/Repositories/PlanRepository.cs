using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class PlanRepository(WorkGridDbContext db) : IPlanRepository
{
    public Task<PlanSection?> GetWithItemsAsync() =>
        db.PlanSections
            .Include(x => x.Items)
            .ThenInclude(x => x.Features)
            .FirstOrDefaultAsync();

    public async Task AddAsync(PlanSection section) =>
        await db.PlanSections.AddAsync(section);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}