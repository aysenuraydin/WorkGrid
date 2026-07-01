using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class GalleryItemService(IGalleryItemRepository repo) : IGalleryItemService
{
    public async Task<List<GalleryItemDto>> GetAllAsync()
    {
        var list = await repo.GetAllAsync();
        return list.Select(Map).ToList();
    }

    public async Task<GalleryItemDto> CreateAsync(GalleryItemCreateDto dto)
    {
        var entity = new GalleryItem
        {
            Name = dto.Name,
            Url = dto.Url,
        };
        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();
        return Map(entity);
    }

    public async Task<GalleryItemDto?> UpdateAsync(int id, GalleryItemUpdateDto dto)
    {
        var entity = await repo.GetByIdAsync(id);
        if (entity is null) return null;

        entity.Name = dto.Name;
        entity.Url = dto.Url;

        await repo.SaveChangesAsync();
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await repo.GetByIdAsync(id);
        if (entity is null) return false;

        repo.Remove(entity);
        await repo.SaveChangesAsync();
        return true;
    }

    private static GalleryItemDto Map(GalleryItem e) =>
        new(e.Id, e.Name, e.Url);
}