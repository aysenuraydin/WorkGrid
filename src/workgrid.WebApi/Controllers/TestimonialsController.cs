
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace WorkGrid.API.Controllers;

[ApiController]

[Route("api/[controller]")]
[Authorize(Roles = "WG")]
public class TestimonialsController(ITestimonialService service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<TestimonialDto>>> GetAll() =>
        Ok(await service.GetAllAsync());

    [HttpPost]
    public async Task<ActionResult<TestimonialDto>> Create(TestimonialDto dto)
    {
        var created = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { }, created);
    }

    [HttpPut("{externalId}")]
    public async Task<ActionResult<TestimonialDto>> Update(string externalId, TestimonialDto dto)
    {
        var updated = await service.UpdateAsync(externalId, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{externalId}")]
    public async Task<IActionResult> Delete(string externalId)
    {
        var deleted = await service.DeleteAsync(externalId);
        return deleted ? NoContent() : NotFound();
    }
}

