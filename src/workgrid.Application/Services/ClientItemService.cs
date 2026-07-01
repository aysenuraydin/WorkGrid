using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class ClientItemService(IClientItemRepository repository) : IClientItemService
{
    public async Task<List<ClientItemDto>> GetAllAsync(CancellationToken ct = default)
    {
        var items = await repository.GetAllAsync(ct);
        return items.Select(Map).ToList();
    }

    public async Task<ClientItemDto> CreateAsync(ClientItemDto dto, CancellationToken ct = default)
    {
        var entity = new ClientItem
        {
            name = dto.name,
            logoUrl = dto.logoUrl
        };

        await repository.AddAsync(entity, ct);
        await repository.SaveChangesAsync(ct);

        return Map(entity);
    }

    public async Task<ClientItemDto> UpdateAsync(int id, ClientItemDto dto, CancellationToken ct = default)
    {
        var entity = await repository.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Id={id} olan client bulunamadı.");

        entity.name = dto.name;
        entity.logoUrl = dto.logoUrl;

        await repository.SaveChangesAsync(ct);

        return Map(entity);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var entity = await repository.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Id={id} olan client bulunamadı.");

        await repository.DeleteAsync(entity, ct);
        await repository.SaveChangesAsync(ct);
    }

    private static ClientItemDto Map(ClientItem e) => new(e.Id, e.name, e.logoUrl);
}

