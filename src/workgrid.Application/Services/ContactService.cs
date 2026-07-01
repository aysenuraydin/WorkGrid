using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Application.Services;

public class ContactService(IContactRepository repo) : IContactService
{
    public async Task<ContactConfigDto> GetAsync()
    {
        var entity = await repo.GetAsync();
        return entity is null
            ? new ContactConfigDto("Adres Girilmedi", "", "09:00 - 18:00", "info@workgrid.com", "")
            : Map(entity);
    }

    public async Task<ContactConfigDto> UpsertAsync(ContactConfigDto dto)
    {
        var entity = await repo.GetAsync();
        if (entity is null)
        {
            entity = new ContactConfig();
            await repo.AddAsync(entity);
        }

        entity.Address1 = dto.Address1;
        entity.Address2 = dto.Address2;
        entity.WorkingHours = dto.WorkingHours;
        entity.Email = dto.Email;
        entity.Phone = dto.Phone;

        await repo.SaveChangesAsync();
        return Map(entity);
    }

    private static ContactConfigDto Map(ContactConfig e) =>
        new(e.Address1, e.Address2, e.WorkingHours, e.Email, e.Phone);
}
