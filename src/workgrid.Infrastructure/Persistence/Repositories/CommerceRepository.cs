using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence;

namespace workgrid.Infrastructure.Repositories;

public class CommerceRepository(WorkGridDbContext context) : ICommerceRepository
{
    public async Task<CommerceConfig?> GetAsync()
    {
        return await context.CommerceConfigs.FirstOrDefaultAsync();
    }

    public async Task AddAsync(CommerceConfig entity)
    {
        await context.CommerceConfigs.AddAsync(entity);
    }

    public async Task SaveChangesAsync()
    {
        await context.SaveChangesAsync();
    }
}