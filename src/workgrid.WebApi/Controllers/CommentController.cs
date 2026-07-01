using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Common.Models;
using workgrid.Application.Features.Comments.Commands.CreateComment;
using workgrid.Application.Features.Comments.Commands.DeleteComment;
using workgrid.Application.Features.Comments.Commands.UpdateComment;
using workgrid.Application.Features.Comments.Queries.GetCommentsByItem;
using workgrid.Application.Features.Comments.Queries.GetCommentsForAdmin;
using workgrid.Application.Features.Comments.Queries.GetRatingAverages;
using workgrid.Application.Features.Comments.Queries.GetRatingSummary;

namespace workgrid.WebApi.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly IMediator _mediator;
    public CommentController(IMediator mediator) => _mediator = mediator;

    [AllowAnonymous]
    [HttpGet("{itemType}/{itemId}")]
    public async Task<IActionResult> GetByItem(CommentItemTypeEnum itemType, string itemId)
        => Ok(await _mediator.Send(new GetCommentsByItemQuery(itemType, itemId)));

    [AllowAnonymous]
    [HttpGet("rating-summary/{itemType}/{itemId}")]
    public async Task<IActionResult> GetRatingSummary(CommentItemTypeEnum itemType, string itemId)
    => Ok(await _mediator.Send(new GetRatingSummaryQuery(itemType, itemId)));

    [AllowAnonymous]
    [HttpPost("rating-averages/{itemType}")]
    public async Task<IActionResult> GetRatingAverages(
    CommentItemTypeEnum itemType,
    [FromBody] List<string> itemIds)
    => Ok(await _mediator.Send(new GetRatingAveragesQuery(itemType, itemIds)));

    [Authorize(Roles = "Admin,WG")]
    [HttpGet("admin/{itemType}")]
    public async Task<IActionResult> GetForAdmin(CommentItemTypeEnum itemType)
        => Ok(await _mediator.Send(new GetCommentsForAdminQuery(itemType)));


    // ── POST: yeni yorum ──
    [HttpPost]
    public async Task<IActionResult> Create(CreateCommentCommand command)
    {
        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, UpdateCommentCommand command)
    {
        if (id != command.Id)
            return BadRequest(Result<bool>.Failure("URL'deki ID ile gövdedeki ID uyuşmuyor!"));

        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var result = await _mediator.Send(new DeleteCommentCommand(id));
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
}


