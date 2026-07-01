using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace WorkGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "WG")]
public class CompanyProjectsController(ICompanyProjectService companyProjectService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<WorkDto>>> GetAll(CancellationToken ct)
        => Ok(await companyProjectService.GetAllAsync(ct));

    [HttpPost]
    public async Task<ActionResult<WorkDto>> Create(WorkDto dto, CancellationToken ct)
    {
        var created = await companyProjectService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetAll), new { }, created);
    }

    [HttpPut("{externalId}")]
    public async Task<ActionResult<WorkDto>> Update(string externalId, WorkDto dto, CancellationToken ct)
    {
        try
        {
            return Ok(await companyProjectService.UpdateAsync(externalId, dto, ct));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{externalId}")]
    public async Task<IActionResult> Delete(string externalId, CancellationToken ct)
    {
        try
        {
            await companyProjectService.DeleteAsync(externalId, ct);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}

