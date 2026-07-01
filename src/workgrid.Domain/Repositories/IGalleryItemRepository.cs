using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface IGalleryItemRepository
{
    Task<List<GalleryItem>> GetAllAsync();
    Task<GalleryItem?> GetByIdAsync(int id);
    Task AddAsync(GalleryItem entity);
    void Remove(GalleryItem entity);
    Task SaveChangesAsync();
}

