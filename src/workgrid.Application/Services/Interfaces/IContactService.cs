using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Application.Services.Interfaces;

public interface IContactService
{
    Task<ContactConfigDto> GetAsync();
    Task<ContactConfigDto> UpsertAsync(ContactConfigDto dto);
}