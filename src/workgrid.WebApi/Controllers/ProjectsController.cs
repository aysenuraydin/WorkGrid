using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Kanban.DTOs;
using workgrid.Application.Kanban.Interfaces;

namespace workgrid.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects(CancellationToken ct)
    {
        var result = await _projectService.GetProjectsAsync(ct);
        return Ok(result);
    }
    [HttpGet("user")]
    public async Task<IActionResult> GetUserProjects(CancellationToken ct)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("Kullanıcı kimliği bulunamadı.");
        }
        var result = await _projectService.GetUserProjectsAsync(userId, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProjectById(Guid id, CancellationToken ct)
    {
        var result = await _projectService.GetProjectByIdAsync(id, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectRequest req, CancellationToken ct)
    {
        var result = await _projectService.CreateProjectAsync(req, ct);
        return CreatedAtAction(nameof(GetProjectById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProject(Guid id, [FromBody] UpdateProjectRequest req, CancellationToken ct)
    {
        var result = await _projectService.UpdateProjectAsync(id, req, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProject(Guid id, CancellationToken ct)
    {
        await _projectService.DeleteProjectAsync(id, ct);
        return NoContent();
    }
}