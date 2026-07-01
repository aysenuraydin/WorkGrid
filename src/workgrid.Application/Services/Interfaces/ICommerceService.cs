using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface ICommerceService
{
    Task<CommerceConfigDto> GetAsync();

    Task<CommerceConfigDto> UpsertAsync(CommerceConfigDto dto);
}
