using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class SocialLinkService(ISocialLinkRepository repo) : ISocialLinkService
{
    public async Task<List<SocialLinkDto>> GetAllAsync()
    {
        var list = await repo.GetAllAsync();
        return list.Select(Map).ToList();
    }

    public async Task<SocialLinkDto> CreateAsync(SocialLinkCreateDto dto)
    {
        var entity = new SocialLink
        {
            Platform = dto.Platform,
            IconUrl = dto.IconUrl,
            Url = dto.Url,
        };
        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();
        return Map(entity);
    }

    public async Task<SocialLinkDto?> UpdateAsync(int id, SocialLinkUpdateDto dto)
    {
        var entity = await repo.GetByIdAsync(id);
        if (entity is null) return null;

        entity.Platform = dto.Platform;
        entity.IconUrl = dto.IconUrl;
        entity.Url = dto.Url;

        await repo.SaveChangesAsync();
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await repo.GetByIdAsync(id);
        if (entity is null) return false;

        repo.Remove(entity);
        await repo.SaveChangesAsync();
        return true;
    }

    private static SocialLinkDto Map(SocialLink e) =>
        new(e.Id, e.Platform, e.IconUrl, e.Url);
}

