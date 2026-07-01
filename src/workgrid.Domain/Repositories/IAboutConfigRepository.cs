using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface IAboutConfigRepository
{
    Task<AboutConfig?> GetAsync();
    Task AddAsync(AboutConfig entity);
    Task SaveChangesAsync();
}
