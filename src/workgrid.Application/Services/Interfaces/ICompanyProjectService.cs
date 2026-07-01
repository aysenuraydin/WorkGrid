using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface ICompanyProjectService
{
    Task<List<WorkDto>> GetAllAsync(CancellationToken ct = default);
    Task<WorkDto> CreateAsync(WorkDto dto, CancellationToken ct = default);
    Task<WorkDto> UpdateAsync(string externalId, WorkDto dto, CancellationToken ct = default);
    Task DeleteAsync(string externalId, CancellationToken ct = default);
}

