using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface IStatsSectionRepository
{
    Task<StatsSection?> GetAsync();
    Task AddAsync(StatsSection entity);
    Task SaveChangesAsync();
}