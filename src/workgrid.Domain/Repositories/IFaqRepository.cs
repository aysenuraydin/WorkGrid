using workgrid.Domain.Entities;
namespace workgrid.Domain.Repositories;

public interface IFaqRepository
{
    Task<List<FaqCategory>> GetAllWithQuestionsAsync();
    Task RemoveRangeAsync(List<FaqCategory> categories);
    Task AddRangeAsync(List<FaqCategory> categories);
    Task SaveChangesAsync();
}