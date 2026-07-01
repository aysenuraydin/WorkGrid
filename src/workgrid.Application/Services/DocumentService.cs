using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;


public class DocumentService(IDocumentRepository repo) : IDocumentService
{
    public async Task<DocumentDto> GetAsync()
    {
        var entity = await repo.GetAsync();
        return entity is null
            ? new DocumentDto()
            : new DocumentDto(entity.Description);
    }

    public async Task<DocumentDto> UpsertAsync(DocumentDto dto)
    {
        var entity = await repo.GetAsync();
        if (entity is null)
        {
            entity = new Document();
            await repo.AddAsync(entity);
        }

        entity.Description = dto.Description;

        await repo.SaveChangesAsync();
        return new DocumentDto(entity.Description);
    }
}