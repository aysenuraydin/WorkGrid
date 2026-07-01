using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class ServiceSectionService : IServiceSectionService
{
    private readonly IServiceRepository _repo;
    public ServiceSectionService(IServiceRepository repo) => _repo = repo;

    public async Task<ServiceSectionDto> GetAsync()
    {
        // 🔒 Hidden. Akış: section'ı öğeleriyle çek → yoksa varsayılan → map.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<ServiceSectionDto> UpsertAsync(ServiceSectionDto dto)
    {
        // 🔒 Hidden. Akış: section'ı çek/oluştur → alanları güncelle →
        //   öğeleri temizle ve yeniden kur → kaydet → map.
        throw new NotImplementedException("Source available on request.");
    }
}