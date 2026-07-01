using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface IBrandRepository
{
    Task<BrandConfig?> GetAsync();
    Task AddAsync(BrandConfig entity);
    Task SaveChangesAsync();
}