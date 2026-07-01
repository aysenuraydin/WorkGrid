using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class LandingHeroService : ILandingHeroService
{
    private readonly ILandingHeroRepository _repo;
    public LandingHeroService(ILandingHeroRepository repo) => _repo = repo;

    public async Task<LandingHeroResponseDto?> GetConfigAsync()
    {
        // 🔒 Hidden. Akış: config'i resimleriyle çek → yoksa oluştur → DTO'ya map (slider sıralı).
        throw new NotImplementedException("Source available on request.");
    }

    public async Task UpdateConfigAsync(UpdateLandingHeroDto dto)
    {
        // 🔒 Hidden. Akış: config'i çek/oluştur → başlık/açıklama güncelle →
        //   eski resimleri sil → yeni resimleri sırayla ekle → kaydet.
        throw new NotImplementedException("Source available on request.");
    }
}