
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface IBrandService
{
    Task<BrandConfigDto> GetAsync();
    Task<BrandConfigDto> UpsertAsync(BrandConfigDto dto);
}