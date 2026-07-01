
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface IClientItemService
{
    Task<List<ClientItemDto>> GetAllAsync(CancellationToken ct = default);
    Task<ClientItemDto> CreateAsync(ClientItemDto dto, CancellationToken ct = default);
    Task<ClientItemDto> UpdateAsync(int id, ClientItemDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}