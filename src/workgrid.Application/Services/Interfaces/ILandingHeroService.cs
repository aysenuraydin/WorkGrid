using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;


public interface ILandingHeroService
{
    Task<LandingHeroResponseDto?> GetConfigAsync();
    Task UpdateConfigAsync(UpdateLandingHeroDto dto);
}
