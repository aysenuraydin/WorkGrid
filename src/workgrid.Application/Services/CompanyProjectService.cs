using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class CompanyProjectService(ICompanyProjectRepository repository) : ICompanyProjectService
{
    public async Task<List<WorkDto>> GetAllAsync(CancellationToken ct = default)
    {
        var works = await repository.GetAllAsync(ct);
        return works.Select(Map).ToList();
    }

    public async Task<WorkDto> CreateAsync(WorkDto dto, CancellationToken ct = default)
    {
        var entity = new Work
        {
            ExternalId = dto.Id,
            Title = dto.Title,
            Category = dto.Category,
            ImageUrl = dto.ImageUrl,
            ClientName = dto.ClientName,
            Link = dto.Link
        };

        await repository.AddAsync(entity, ct);
        await repository.SaveChangesAsync(ct);

        return Map(entity);
    }

    public async Task<WorkDto> UpdateAsync(string externalId, WorkDto dto, CancellationToken ct = default)
    {
        var entity = await repository.GetByExternalIdAsync(externalId, ct)
            ?? throw new KeyNotFoundException($"ExternalId={externalId} olan proje bulunamadı.");

        entity.Title = dto.Title;
        entity.Category = dto.Category;
        entity.ImageUrl = dto.ImageUrl;
        entity.ClientName = dto.ClientName;
        entity.Link = dto.Link;

        await repository.SaveChangesAsync(ct);

        return Map(entity);
    }

    public async Task DeleteAsync(string externalId, CancellationToken ct = default)
    {
        var entity = await repository.GetByExternalIdAsync(externalId, ct)
            ?? throw new KeyNotFoundException($"ExternalId={externalId} olan proje bulunamadı.");

        await repository.DeleteAsync(entity, ct);
        await repository.SaveChangesAsync(ct);
    }

    private static WorkDto Map(Work e) =>
        new(e.ExternalId, e.Title, e.Category, e.ImageUrl, e.ClientName, e.Link);
}

