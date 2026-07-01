using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace WorkGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandController(IBrandService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<BrandConfigDto>> Get() =>
        Ok(await service.GetAsync());

    [HttpPut]
    [Authorize(Roles = "WG")]
    public async Task<ActionResult<BrandConfigDto>> Upsert(BrandConfigDto dto) =>
        Ok(await service.UpsertAsync(dto));
}
