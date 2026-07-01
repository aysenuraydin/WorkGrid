using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Common.Models;
using workgrid.Application.Features.TableCells.Commands.UpdateBulkTableCell;
using workgrid.Application.Features.TableCells.Commands.UpdateTableCell;
using workgrid.Application.Features.TableCells.Queries.GetTableColumnTableById;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;

namespace workgrid.WebApi.Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "WG, Admin, User")]
public class TableCellController : BaseController<TableCell, long>
{
    private readonly IMediator _mediator;
    public TableCellController(ITableCellService service, IMediator mediator) : base(service)
    {
        _mediator = mediator;
    }

    [HttpGet("column/{columnId}")]
    public async Task<IActionResult> GetAllTableCellsByColumnId(long columnId)
    => Ok(await _mediator.Send(new GetTableCellsByColumnIdQuery(columnId)));

    [HttpGet("table/{tableId}")]
    public async Task<IActionResult> GetAllTableCellsByTableId(long tableId)
    => Ok(await _mediator.Send(new GetColumnCellsByTableIdQuery(tableId)));

    [HttpGet("filteredCells/{tableId}")]
    public async Task<IActionResult> GetAllFilteredCellsByTableId(long tableId)
    => Ok(await _mediator.Send(new GetFilteredColumnCellsByTableIdQuery(tableId)));

    [HttpPut("{cellId}")]
    public async Task<IActionResult> UpdateTableCell(long cellId, UpdateTableCellCommand command)
    {
        if (cellId != command.CellId)
            return BadRequest(Result<bool>.Failure("URL'deki ID ile gövdedeki ID uyuşmuyor!"));

        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    [HttpPut]
    public async Task<IActionResult> UpdateBulkTableCell(UpdateBulkTableCellCommand command)
    {
        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
}

























