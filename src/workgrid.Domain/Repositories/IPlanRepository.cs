using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface IPlanRepository
{
    Task<PlanSection?> GetWithItemsAsync();
    Task AddAsync(PlanSection section);
    Task SaveChangesAsync();
}