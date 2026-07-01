using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface IAboutConfigService
{
    Task<AboutConfigDto> GetAsync();
    Task<AboutConfigDto> UpsertAsync(AboutConfigDto dto);
}
