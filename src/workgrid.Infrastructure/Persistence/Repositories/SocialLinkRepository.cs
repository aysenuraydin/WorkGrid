using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class SocialLinkRepository(WorkGridDbContext db) : ISocialLinkRepository
{
    public Task<List<SocialLink>> GetAllAsync() =>
        db.SocialLinks.ToListAsync();

    public Task<SocialLink?> GetByIdAsync(int id) =>
        db.SocialLinks.FirstOrDefaultAsync(x => x.Id == id);

    public async Task AddAsync(SocialLink entity) =>
        await db.SocialLinks.AddAsync(entity);

    public void Remove(SocialLink entity) =>
        db.SocialLinks.Remove(entity);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}
