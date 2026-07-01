using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Common.Models;
using workgrid.Application.Features.TableRows.Commands.CreateBulkTableRow;
using workgrid.Application.Features.TableRows.Commands.CreateTableRow;
using workgrid.Application.Features.TableRows.Commands.DeleteRow;
using workgrid.Application.Features.TableRows.Commands.RestoreDeletedRow;
using workgrid.Application.Features.TableRows.Queries.GetTableColumnTableById;
using workgrid.Application.Features.TableRows.Queries.GetTables;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;

namespace workgrid.WebApi.Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "WG, Admin, User")]
public class TableRowController : BaseController<TableRow, long>
{
    private readonly IMediator _mediator;
    public TableRowController(ITableRowService service, IMediator mediator) : base(service)
    {
        _mediator = mediator;
    }
    [HttpGet("table/{tableId}")]
    public async Task<IActionResult> GetAllTableRowByDatatableId(long tableId)
        => Ok(await _mediator.Send(new GetTableRowsByTableIdQuery(tableId)));

    [HttpGet("datatable/{tableId}")]
    public async Task<IActionResult> GetAllTableRowByTableId(long tableId)
        => Ok(await _mediator.Send(new GetDatatableRowsByTableIdQuery(tableId)));

    [HttpGet("column/{columnId}")]
    public async Task<IActionResult> GetAllTableRowByColumnId(long columnId)
        => Ok(await _mediator.Send(new GetTableRowsByColumnIdQuery(columnId)));

    [HttpGet("foreigns/{cellId}/{realRowId}")]
    public async Task<IActionResult> GetForeignTableRowByCellId(long cellId, long realRowId)
    => Ok(await _mediator.Send(new GetDatatableForeignTableRowByCellIdQuery(cellId, realRowId)));

    [HttpGet("deleted/{tableId}")]
    [Authorize(Roles = "WG, Admin")]
    public async Task<IActionResult> GetAllDeletedTableRowByTableId(long tableId)
        => Ok(await _mediator.Send(new GetDeletedTableRowsByTableIdQuery(tableId)));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTableRowById(long id)
        => Ok(await _mediator.Send(new GetTableRowsByIdQuery(id)));

    [HttpGet("foreigns/{tableId}")]
    public async Task<IActionResult> GetForeignTableRowTableId(long tableId)
        => Ok(await _mediator.Send(new GetForeignTableRowByTableIdQuery(tableId)));

    [HttpPost]
    public async Task<IActionResult> CreateTableRow(CreateTableRowCommand command)
        => Ok(await _mediator.Send(command));

    [HttpDelete("restore/{rowId}")]
    public async Task<IActionResult> RestoreTableRow(long rowId)
        => Ok(await _mediator.Send(new RestoreTableRowCommand(rowId)));

    [HttpDelete("{rowId}")]
    public async Task<IActionResult> DeleteTableRow(long rowId)
        => Ok(await _mediator.Send(new DeleteTableRowCommand(rowId)));

    [HttpDelete("hardDelete/{rowId}")]
    public async Task<IActionResult> HardDeleteTableRow(long rowId)
        => Ok(await _mediator.Send(new HardDeleteTableRowCommand(rowId)));




    [HttpPost("bulk/{id}")]
    public async Task<IActionResult> CreateBulkTableRow(long id, CreateBulkTableRowCommand command)
    {
        if (id != command.TableId)
            return BadRequest(Result<bool>.Failure("URL'deki ID ile gövdedeki ID uyuşmuyor!"));

        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpPut("bulkRestore/{id}")]
    public async Task<IActionResult> RestoreBulkTableRow(long id, [FromBody] RestoreBulkTableRowCommand command)
    {
        if (id != command.TableId)
            return BadRequest(Result<bool>.Failure("URL'deki ID ile gövdedeki ID uyuşmuyor!"));

        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("bulk/{id}")]
    public async Task<IActionResult> DeleteBulkTableRow(long id, [FromBody] DeleteBulkTableRowCommand command)
    {
        if (id != command.TableId)
            return BadRequest(Result<bool>.Failure("URL'deki ID ile gövdedeki ID uyuşmuyor!"));

        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("bulkHardDelete/{id}")]
    public async Task<IActionResult> HardDeleteBulkTableRow(long id, [FromBody] HardDeleteBulkTableRowCommand command)
    {
        if (id != command.TableId)
            return BadRequest(Result<bool>.Failure("URL'deki ID ile gövdedeki ID uyuşmuyor!"));

        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
}




















