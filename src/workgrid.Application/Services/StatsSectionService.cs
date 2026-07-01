using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class StatsSectionService(IStatsSectionRepository repo) : IStatsSectionService
{
    public async Task<StatsSectionDto> GetAsync()
    {
        var entity = await repo.GetAsync();
        return entity is null ? new StatsSectionDto(0, 0, 0, 0) : Map(entity);
    }

    public async Task<StatsSectionDto> UpsertAsync(StatsSectionDto dto)
    {
        var entity = await repo.GetAsync();
        if (entity is null)
        {
            entity = new StatsSection();
            await repo.AddAsync(entity);
        }

        entity.ProjectsCompleted = dto.ProjectsCompleted;
        entity.AwardsWon = dto.AwardsWon;
        entity.SatisfiedClients = dto.SatisfiedClients;
        entity.Employees = dto.Employees;

        await repo.SaveChangesAsync();
        return Map(entity);
    }

    private static StatsSectionDto Map(StatsSection e) =>
        new(e.ProjectsCompleted, e.AwardsWon, e.SatisfiedClients, e.Employees);
}
