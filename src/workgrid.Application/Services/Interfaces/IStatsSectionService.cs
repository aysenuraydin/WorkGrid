using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface IStatsSectionService
{
    Task<StatsSectionDto> GetAsync();
    Task<StatsSectionDto> UpsertAsync(StatsSectionDto dto);
}