using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace WorkGrid.API.Controllers;

[ApiController]
[Authorize(Roles = "WG")]
[Route("api/[controller]")]
public class AboutController(IAboutConfigService service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<AboutConfigDto>> Get() =>
        Ok(await service.GetAsync());

    [HttpPut]
    public async Task<ActionResult<AboutConfigDto>> Upsert(AboutConfigDto dto) =>
        Ok(await service.UpsertAsync(dto));
}














