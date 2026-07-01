using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using workgrid.Application.Kanban.DTOs;
using workgrid.Application.Kanban.Interfaces;

namespace workgrid.Api.Controllers;

[ApiController]
[Route("api/kanban")]
[Authorize]
public class KanbanController : ControllerBase
{
    private readonly IKanbanService _svc;
    public KanbanController(IKanbanService svc) => _svc = svc;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;


    [HttpGet("board/{projectId:guid}")]
    public async Task<IActionResult> GetBoardByProject(Guid projectId, CancellationToken ct)
    {
        var result = await _svc.GetBoardByProjectAsync(projectId, ct);
        return Ok(result);
    }
    [HttpGet("card/{cardId:guid}")]
    public async Task<IActionResult> GetCardProject(Guid cardId, CancellationToken ct)
    {
        var result = await _svc.GetCardByProjectAsync(cardId, ct);
        return Ok(result);
    }


    [HttpPost("cards")]
    public async Task<IActionResult> CreateCard([FromBody] CreateCardRequest req, CancellationToken ct)
    {
        var result = await _svc.CreateCardAsync(req, ct);

        return CreatedAtAction(nameof(GetBoardByProject), new { projectId = result.ProjectId }, result);
    }


    [HttpPut("cards/{cardId:guid}")]
    public async Task<IActionResult> UpdateCard(Guid cardId, [FromBody] UpdateCardRequest req, CancellationToken ct)
        => Ok(await _svc.UpdateCardAsync(cardId, req, ct));

    [HttpDelete("cards/{cardId:guid}")]
    public async Task<IActionResult> DeleteCard(Guid cardId, CancellationToken ct)
    {
        await _svc.DeleteCardAsync(cardId, ct);
        return NoContent();
    }
    [HttpPost("cards/{cardId:guid}/move")]
    public async Task<IActionResult> MoveCard(Guid cardId, [FromBody] MoveCardRequest req, CancellationToken ct)
    {
        await _svc.MoveCardAsync(cardId, req, ct);
        return NoContent();
    }
}