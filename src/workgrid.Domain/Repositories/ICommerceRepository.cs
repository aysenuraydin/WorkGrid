using workgrid.Domain.Common;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;

namespace workgrid.Domain.Repositories;

public interface ICommerceRepository
{
    Task<CommerceConfig?> GetAsync();
    Task AddAsync(CommerceConfig entity);
    Task SaveChangesAsync();
}