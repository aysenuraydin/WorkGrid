using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class BrandService(IBrandRepository repo) : IBrandService
{
    public async Task<BrandConfigDto> GetAsync()
    {
        var entity = await repo.GetAsync();
        return entity is null
            ? new BrandConfigDto()
            : new BrandConfigDto(entity.CompanyName, entity.Description, entity.Website);
    }

    public async Task<BrandConfigDto> UpsertAsync(BrandConfigDto dto)
    {
        var entity = await repo.GetAsync();
        if (entity is null)
        {
            entity = new BrandConfig();
            await repo.AddAsync(entity);
        }

        entity.CompanyName = dto.CompanyName;
        entity.Description = dto.Description;
        entity.Website = dto.Website;

        await repo.SaveChangesAsync();
        return new BrandConfigDto(entity.CompanyName, entity.Description, entity.Website);
    }
}
