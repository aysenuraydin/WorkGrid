using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class TestimonialService(ITestimonialRepository repo) : ITestimonialService
{
    public async Task<List<TestimonialDto>> GetAllAsync()
    {
        var list = await repo.GetAllAsync();
        return list.Select(Map).ToList();
    }

    public async Task<TestimonialDto> CreateAsync(TestimonialDto dto)
    {
        var entity = new Testimonial
        {
            ExternalId = dto.Id,
            Name = dto.Name,
            Role = dto.Role,
            Comment = dto.Comment,
            AvatarUrl = dto.AvatarUrl,
            Rating = dto.Rating,
        };
        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();
        return Map(entity);
    }

    public async Task<TestimonialDto?> UpdateAsync(string externalId, TestimonialDto dto)
    {
        var entity = await repo.GetByExternalIdAsync(externalId);
        if (entity is null) return null;

        entity.Name = dto.Name;
        entity.Role = dto.Role;
        entity.Comment = dto.Comment;
        entity.AvatarUrl = dto.AvatarUrl;
        entity.Rating = dto.Rating;

        await repo.SaveChangesAsync();
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(string externalId)
    {
        var entity = await repo.GetByExternalIdAsync(externalId);
        if (entity is null) return false;

        repo.Remove(entity);
        await repo.SaveChangesAsync();
        return true;
    }

    private static TestimonialDto Map(Testimonial e) =>
        new(e.ExternalId, e.Name, e.Role, e.Comment, e.AvatarUrl, e.Rating);
}
