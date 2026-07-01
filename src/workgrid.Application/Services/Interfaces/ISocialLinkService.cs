using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface ISocialLinkService
{
    Task<List<SocialLinkDto>> GetAllAsync();
    Task<SocialLinkDto> CreateAsync(SocialLinkCreateDto dto);
    Task<SocialLinkDto?> UpdateAsync(int id, SocialLinkUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}