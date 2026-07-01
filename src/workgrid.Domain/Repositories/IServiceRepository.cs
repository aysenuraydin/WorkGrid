using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface IServiceRepository
{
    Task<ServiceSection?> GetWithItemsAsync();
    Task AddAsync(ServiceSection section);
    Task SaveChangesAsync();
}