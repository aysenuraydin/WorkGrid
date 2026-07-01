
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface IPlanService
{
    Task<PlanSectionDto> GetAsync();
    Task<PlanSectionDto> UpsertAsync(PlanSectionDto dto);
}