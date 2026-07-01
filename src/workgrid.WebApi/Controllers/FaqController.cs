using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace WorkGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FaqController(IFaqService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<FaqCategoryDto>>> GetAll() =>
        Ok(await service.GetAllAsync());

    [HttpPut]
    [Authorize(Roles = "WG")]
    public async Task<ActionResult<List<FaqCategoryDto>>> Upsert(List<FaqCategoryDto> dto) =>
        Ok(await service.UpsertAsync(dto));
}
