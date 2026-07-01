using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;

namespace WorkGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize(Roles = "WG")]
public class TenantController : ControllerBase
{
    private readonly ITenantConfigService _tenantConfigService;

    public TenantController(ITenantConfigService tenantConfigService)
    {
        _tenantConfigService = tenantConfigService;
    }

    [HttpGet("config")]
    [AllowAnonymous]
    public async Task<IActionResult> GetConfig(CancellationToken ct)
    {
        var config = await _tenantConfigService.GetConfigAsync(ct);
        return Ok(config);
    }

    [HttpPut("config")]
    public async Task<IActionResult> UpdateConfig([FromBody] TenantConfig incoming, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _tenantConfigService.UpdateConfigAsync(incoming, ct);
        return Ok(updated);
    }

    [HttpPut("reset")]
    public async Task<IActionResult> ResetToDefault(CancellationToken ct)
    {
        var config = await _tenantConfigService.ResetToDefaultAsync(ct);
        return Ok(config);
    }

    [HttpDelete("cache")]
    public IActionResult ClearCache()
    {
        _tenantConfigService.InvalidateCache();
        return NoContent();
    }
}

