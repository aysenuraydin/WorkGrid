using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace WorkGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "WG")]
public class SocialLinksController(ISocialLinkService service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<SocialLinkDto>>> GetAll() =>
        Ok(await service.GetAllAsync());

    [HttpPost]
    public async Task<ActionResult<SocialLinkDto>> Create(SocialLinkCreateDto dto)
    {
        var created = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<SocialLinkDto>> Update(int id, SocialLinkUpdateDto dto)
    {
        var updated = await service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
