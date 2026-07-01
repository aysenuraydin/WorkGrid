using workgrid.DTO.DTOs;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface IDocumentService
{
    Task<DocumentDto> GetAsync();
    Task<DocumentDto> UpsertAsync(DocumentDto dto);
}


