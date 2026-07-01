using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class FaqService(IFaqRepository repo) : IFaqService
{
    public async Task<List<FaqCategoryDto>> GetAllAsync()
    {
        var categories = await repo.GetAllWithQuestionsAsync();
        return categories.Select(MapCategory).ToList();
    }

    public async Task<List<FaqCategoryDto>> UpsertAsync(List<FaqCategoryDto> dto)
    {
        var existing = await repo.GetAllWithQuestionsAsync();
        await repo.RemoveRangeAsync(existing);
        await repo.SaveChangesAsync();

        var newCategories = dto.Select(c => new FaqCategory
        {
            Category = c.Category,
            Icon = c.Icon,
            Questions = c.Questions
                .Select(q => new FaqQuestion { Q = q.Q, A = q.A })
                .ToList(),
        }).ToList();

        await repo.AddRangeAsync(newCategories);
        await repo.SaveChangesAsync();

        return newCategories.Select(MapCategory).ToList();
    }

    private static FaqCategoryDto MapCategory(FaqCategory c) =>
        new(c.Id, c.Category, c.Icon,
            c.Questions.Select(q => new FaqQuestionDto(q.Id, q.Q, q.A)).ToList());
}
