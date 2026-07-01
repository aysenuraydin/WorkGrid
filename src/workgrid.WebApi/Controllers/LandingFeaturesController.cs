using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace WorkGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "WG")]
public class LandingFeaturesController : ControllerBase
{
    private readonly ILandingFeaturesService _landingFeaturesService;

    public LandingFeaturesController(ILandingFeaturesService landingFeaturesService)
    {
        _landingFeaturesService = landingFeaturesService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeatures(CancellationToken ct)
    {
        var features = await _landingFeaturesService.GetFeaturesAsync(ct);
        return Ok(features);
    }

    [HttpGet("cta")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCtaConfig(CancellationToken ct)
    {
        var cta = await _landingFeaturesService.GetCtaConfigAsync(ct);
        return Ok(cta);
    }

    [HttpPost]
    public async Task<IActionResult> CreateFeature([FromBody] CreateFeatureItemCommand command, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _landingFeaturesService.CreateFeatureAsync(command, ct);
        return Ok("Özellik başarıyla eklendi.");
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateFeature(int id, [FromBody] CreateFeatureItemCommand command, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            await _landingFeaturesService.UpdateFeatureAsync(id, command, ct);
            return Ok("Özellik başarıyla güncellendi.");
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("cta")]
    public async Task<IActionResult> UpdateCtaConfig([FromBody] UpdateCtaCommand command, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _landingFeaturesService.UpdateCtaConfigAsync(command, ct);
        return Ok("CTA ayarları güncellendi.");
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteFeature(int id, CancellationToken ct)
    {
        try
        {
            await _landingFeaturesService.DeleteFeatureAsync(id, ct);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
