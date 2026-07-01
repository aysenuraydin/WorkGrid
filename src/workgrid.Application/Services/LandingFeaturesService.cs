using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class LandingFeaturesService : ILandingFeaturesService
{
    private readonly ILandingFeaturesRepository _repository;

    public LandingFeaturesService(ILandingFeaturesRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<FeatureItemDto>> GetFeaturesAsync(CancellationToken ct = default)
    {
        var features = await _repository.GetAllWithDetailsAsync(ct);

        return features.Select(f => new FeatureItemDto(
            f.Id, f.Title, f.SubTitle, f.Description,
            f.ImageUrl, f.IconUrl, f.OrderNumber, f.IsRight, f.BgColor,
            f.FeaturesDetails
                .Select(d => new FeatureDetailDto(d.Id, d.Label, d.Value, d.IsApproved))
                .ToList()
        )).ToList();
    }

    public async Task<CtaConfigDto> GetCtaConfigAsync(CancellationToken ct = default)
    {
        var cta = await _repository.GetCtaConfigAsync(ct);

        return cta is null
            ? new CtaConfigDto("Build your web App/SaaS with Workgrid dashboard", "Buy Now", "/landing")
            : new CtaConfigDto(cta.Text, cta.ButtonText, cta.ButtonUrl);
    }

    public async Task CreateFeatureAsync(CreateFeatureItemCommand command, CancellationToken ct = default)
    {
        var feature = new FeatureItem
        {
            Title = command.Title,
            SubTitle = command.SubTitle,
            Description = command.Description,
            ImageUrl = command.ImageUrl,
            IconUrl = command.IconUrl,
            OrderNumber = command.OrderNumber,
            IsRight = command.IsRight,
            BgColor = command.BgColor,
            FeaturesDetails = command.FeaturesDetails.Select(d => new FeatureDetail
            {
                Label = d.Label,
                Value = d.Value,
                IsApproved = d.IsApproved
            }).ToList()
        };

        await _repository.AddFeatureAsync(feature, ct);
        await _repository.SaveChangesAsync(ct);
    }

    public async Task UpdateFeatureAsync(int id, CreateFeatureItemCommand command, CancellationToken ct = default)
    {
        var existing = await _repository.GetByIdWithDetailsAsync(id, ct)
            ?? throw new KeyNotFoundException($"Id={id} olan özellik bulunamadı.");

        existing.Title = command.Title;
        existing.SubTitle = command.SubTitle;
        existing.Description = command.Description;
        existing.ImageUrl = command.ImageUrl;
        existing.IconUrl = command.IconUrl;
        existing.OrderNumber = command.OrderNumber;
        existing.IsRight = command.IsRight;
        existing.BgColor = command.BgColor;

        existing.FeaturesDetails.Clear();
        foreach (var d in command.FeaturesDetails)
        {
            existing.FeaturesDetails.Add(new FeatureDetail
            {
                Label = d.Label,
                Value = d.Value,
                IsApproved = d.IsApproved
            });
        }

        await _repository.SaveChangesAsync(ct);
    }

    public async Task UpdateCtaConfigAsync(UpdateCtaCommand command, CancellationToken ct = default)
    {
        var cta = await _repository.GetCtaConfigAsync(ct);

        if (cta is null)
        {
            cta = new CtaConfig
            {
                Text = command.Text,
                ButtonText = command.ButtonText,
                ButtonUrl = command.ButtonUrl
            };
            await _repository.AddCtaConfigAsync(cta, ct);
        }
        else
        {
            cta.Text = command.Text;
            cta.ButtonText = command.ButtonText;
            cta.ButtonUrl = command.ButtonUrl;
        }

        await _repository.SaveChangesAsync(ct);
    }

    public async Task DeleteFeatureAsync(int id, CancellationToken ct = default)
    {
        var feature = await _repository.GetByIdWithDetailsAsync(id, ct)
            ?? throw new KeyNotFoundException($"Id={id} olan özellik bulunamadı.");

        await _repository.DeleteFeatureAsync(feature, ct);
        await _repository.SaveChangesAsync(ct);
    }
}

