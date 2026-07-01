using workgrid.DTO.DTOs;
namespace workgrid.Application.Services.Interfaces;

public interface ILandingFeaturesService
{
    Task<List<FeatureItemDto>> GetFeaturesAsync(CancellationToken ct = default);
    Task<CtaConfigDto> GetCtaConfigAsync(CancellationToken ct = default);
    Task CreateFeatureAsync(CreateFeatureItemCommand command, CancellationToken ct = default);
    Task UpdateFeatureAsync(int id, CreateFeatureItemCommand command, CancellationToken ct = default);
    Task UpdateCtaConfigAsync(UpdateCtaCommand command, CancellationToken ct = default);
    Task DeleteFeatureAsync(int id, CancellationToken ct = default);
}