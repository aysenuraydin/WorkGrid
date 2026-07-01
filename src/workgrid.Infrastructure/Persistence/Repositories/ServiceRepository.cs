using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class ServiceRepository(WorkGridDbContext db) : IServiceRepository
{
    public Task<ServiceSection?> GetWithItemsAsync() =>
        db.ServiceSections
            .Include(x => x.Items)
            .FirstOrDefaultAsync();

    public async Task AddAsync(ServiceSection section) =>
        await db.ServiceSections.AddAsync(section);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}
