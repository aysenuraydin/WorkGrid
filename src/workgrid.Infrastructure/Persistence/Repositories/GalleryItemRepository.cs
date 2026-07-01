using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class GalleryItemRepository(WorkGridDbContext db) : IGalleryItemRepository
{
    public Task<List<GalleryItem>> GetAllAsync() =>
        db.GalleryItems.ToListAsync();

    public Task<GalleryItem?> GetByIdAsync(int id) =>
        db.GalleryItems.FirstOrDefaultAsync(x => x.Id == id);

    public async Task AddAsync(GalleryItem entity) =>
        await db.GalleryItems.AddAsync(entity);

    public void Remove(GalleryItem entity) =>
        db.GalleryItems.Remove(entity);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}
