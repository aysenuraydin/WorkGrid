
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;


public interface IServiceSectionService
{
    Task<ServiceSectionDto> GetAsync();
    Task<ServiceSectionDto> UpsertAsync(ServiceSectionDto dto);
}
