using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class CommerceService(ICommerceRepository repo) : ICommerceService
{
    public async Task<CommerceConfigDto> GetAsync()
    {
        var entity = await repo.GetAsync();
        return entity is null
            ? new CommerceConfigDto("₺", string.Empty, 0)
            : new CommerceConfigDto(entity.CurrencyCode, entity.InvoiceNotes, entity.DefaultShippingFee);
    }

    public async Task<CommerceConfigDto> UpsertAsync(CommerceConfigDto dto)
    {
        var entity = await repo.GetAsync();

        if (entity is null)
        {
            entity = new CommerceConfig();
            await repo.AddAsync(entity);
        }

        entity.CurrencyCode = dto.CurrencyCode;
        entity.InvoiceNotes = dto.InvoiceNotes;
        entity.DefaultShippingFee = dto.DefaultShippingFee;

        await repo.SaveChangesAsync();

        return new CommerceConfigDto(entity.CurrencyCode, entity.InvoiceNotes, entity.DefaultShippingFee);
    }
}