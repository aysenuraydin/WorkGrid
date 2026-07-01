using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;


public class AboutConfigService(IAboutConfigRepository repo) : IAboutConfigService
{
    public async Task<AboutConfigDto> GetAsync()
    {
        var entity = await repo.GetAsync();
        return entity is null
            ? new AboutConfigDto()
            : new AboutConfigDto(entity.Url, entity.Description);
    }

    public async Task<AboutConfigDto> UpsertAsync(AboutConfigDto dto)
    {
        var entity = await repo.GetAsync();
        if (entity is null)
        {
            entity = new AboutConfig();
            await repo.AddAsync(entity);
        }

        entity.Url = dto.Url;
        entity.Description = dto.Description;

        await repo.SaveChangesAsync();
        return new AboutConfigDto(entity.Url, entity.Description);
    }
}