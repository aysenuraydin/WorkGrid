using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class PlanService : IPlanService
{
    private readonly IPlanRepository _repo;
    public PlanService(IPlanRepository repo) => _repo = repo;

    public async Task<PlanSectionDto> GetAsync()
    {
        // 🔒 Hidden. Akış: section'ı çek → yoksa varsayılan DTO → map.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<PlanSectionDto> UpsertAsync(PlanSectionDto dto)
    {
        // 🔒 Hidden. Akış: section'ı çek/oluştur → alanları güncelle →
        //   öğeleri temizle ve yeniden kur (plan + feature) → kaydet → map.
        throw new NotImplementedException("Source available on request.");
    }
}