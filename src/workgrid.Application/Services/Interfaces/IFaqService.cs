
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface IFaqService
{
    Task<List<FaqCategoryDto>> GetAllAsync();
    Task<List<FaqCategoryDto>> UpsertAsync(List<FaqCategoryDto> dto);
}
