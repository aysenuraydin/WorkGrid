using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Common.Models;
using workgrid.Application.Features.Datatables.Commands.RestoreDeletedMenuItem;
using workgrid.Application.Features.MenuItems.Commands.ChangePrivacyMenuItem;
using workgrid.Application.Features.MenuItems.Commands.CreateDivider;
using workgrid.Application.Features.MenuItems.Commands.CreateMenuItem;
using workgrid.Application.Features.MenuItems.Commands.DeleteMenuItem;
using workgrid.Application.Features.MenuItems.Commands.HardDeleteMenuItem;
using workgrid.Application.Features.MenuItems.Commands.ShowOrHideMenuItem;
using workgrid.Application.Features.MenuItems.Commands.UpdateDivider;
using workgrid.Application.Features.MenuItems.Commands.UpdateMenuItem;
using workgrid.Application.Features.MenuItems.Commands.updateMenuItemOrder;
using workgrid.Application.Features.MenuItems.Queries.GetDeletedMenuItems;
using workgrid.Application.Features.MenuItems.Queries.GetMenuItemById;
using workgrid.Application.Features.MenuItems.Queries.GetMenuItems;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;

namespace workgrid.WebApi.Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "WG")]
public class MenuItemController : BaseController<MenuItem, long>
{
    private readonly IMediator _mediator;
    public MenuItemController(IMenuItemService service, IMediator mediator) : base(service)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllMenuItems()
        => Ok(await _mediator.Send(new GetMenuItemsQuery()));

    [HttpGet("deleted")]
    public async Task<IActionResult> GetAllDeletedMenuItems()
        => Ok(await _mediator.Send(new GetDeletedMenuItemsQuery()));

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetMenuItemById(long id)
        => Ok(await _mediator.Send(new GetMenuItemByIdQuery(id)));

    [HttpPost("item")]
    public async Task<IActionResult> CreateItem(CreateMenuItemCommand command)
        => Ok(await _mediator.Send(command));

    [HttpPost("divider")]
    public async Task<IActionResult> CreateDivider(CreateDividerCommand command)
        => Ok(await _mediator.Send(command));

    [HttpPut("item/{id}")]
    public async Task<IActionResult> UpdateItem(long id, UpdateMenuItemCommand command)
    {
        if (id != command.Id)
            return BadRequest(Result<bool>.Failure("URL'deki ID ile gövdedeki ID uyuşmuyor!"));

        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    [HttpPut("divider/{id}")]
    public async Task<IActionResult> UpdateDivider(long id, UpdateDividerCommand command)
    {
        if (id != command.Id)
            return BadRequest(Result<bool>.Failure("URL'deki ID ile gövdedeki ID uyuşmuyor!"));

        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    [HttpPut("showOrHide/{id}")]
    public async Task<IActionResult> ShowOrHide(long id, ShowOrHideMenuItemCommand command)
    {
        if (id != command.Id)
            return BadRequest(Result<bool>.Failure("URL'deki ID ile gövdedeki ID uyuşmuyor!"));

        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    [HttpPut("changePrivacy/{id}")]
    public async Task<IActionResult> ChangePrivacyMenuItem(long id, ChangePrivacyMenuItemCommand command)
    {
        if (id != command.Id)
            return BadRequest(Result<bool>.Failure("URL'deki ID ile gövdedeki ID uyuşmuyor!"));

        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPut("changeOrder/{id}")]
    public async Task<IActionResult> ChangeOrder(long id, updateMenuItemOrderCommand command)
    {
        if (id != command.Id)
            return BadRequest(Result<bool>.Failure("URL'deki ID ile gövdedeki ID uyuşmuyor!"));

        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMenuItem(long id)
        => Ok(await _mediator.Send(new DeleteMenuItemCommand(id)));

    [HttpDelete("hardDelete/{id}")]
    public async Task<IActionResult> HardDeleteMenuItem(long id)
        => Ok(await _mediator.Send(new HardDeleteMenuItemCommand(id)));

    [HttpDelete("restore/{id}")]
    public async Task<IActionResult> RestoreMenuItem(long id)
        => Ok(await _mediator.Send(new RestoreDeletedMenuItemCommand(id)));

}