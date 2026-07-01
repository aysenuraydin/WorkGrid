using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface IGalleryItemService
{
    Task<List<GalleryItemDto>> GetAllAsync();
    Task<GalleryItemDto> CreateAsync(GalleryItemCreateDto dto);
    Task<GalleryItemDto?> UpdateAsync(int id, GalleryItemUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}

