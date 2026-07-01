using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface IContactRepository
{
    Task<ContactConfig?> GetAsync();
    Task AddAsync(ContactConfig entity);
    Task SaveChangesAsync();
}