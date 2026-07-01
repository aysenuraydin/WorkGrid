

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Features.Rows.Commands.CreateRow;
using workgrid.Application.Features.Rows.Commands.DeleteRow;
using workgrid.Application.Features.Rows.Commands.PatchRow;
using workgrid.Application.Features.Rows.Commands.UpdateRow;
using workgrid.Application.Features.Rows.Queries.GetAllRows;
using workgrid.Application.Features.Rows.Queries.GetOneRow;
using workgrid.Application.Features.Rows.Queries.GetPagedRows;
using workgrid.Application.Features.Rows.Queries.GetRowById;
using workgrid.Application.Features.Tables.Commands.SetTableAccess;
using workgrid.Application.Services.Interfaces;

namespace workgrid.WebApi.Controllers;

public partial class GridBaseController
{
    [HttpGet("{tableName}")]
    public async Task<IActionResult> GetAll(
        string tableName,
        [FromQuery(Name = "filter")] string[]? filter = null,
        [FromQuery] string? sort = null,
        [FromQuery] string? select = null,
        [FromQuery] string? search = null,
        [FromQuery] string? searchFields = null,
        [FromQuery] string? expand = null)
    {
        var filters = filter?.Select(FilterDescriptor.TryParse).Where(f => f is not null).Cast<FilterDescriptor>().ToList() ?? [];
        var q = new GetAllRowsQuery(tableName, filters, SortDescriptor.TryParse(sort),
            SelectDescriptor.TryParse(select), search, ParseList(searchFields), ParseList(expand));
        return ToResult(await _mediator.Send(q));
    }

    [HttpGet("{tableName}/one")]
    public async Task<IActionResult> GetOne(
        string tableName,
        [FromQuery(Name = "filter")] string[]? filter = null,
        [FromQuery] string? sort = null,
        [FromQuery] string? select = null,
        [FromQuery] string? expand = null)
    {
        var filters = filter?.Select(FilterDescriptor.TryParse).Where(f => f is not null).Cast<FilterDescriptor>().ToList() ?? [];
        var q = new GetOneRowQuery(tableName, filters, SortDescriptor.TryParse(sort),
            SelectDescriptor.TryParse(select), ParseList(expand));
        return ToResult(await _mediator.Send(q));
    }

    [HttpGet("{tableName}/paged")]
    public async Task<IActionResult> GetPaged(
        string tableName,
        [FromQuery] int page = 1,
        [FromQuery] int? size = null,
        [FromQuery(Name = "filter")] string[]? filter = null,
        [FromQuery] string? sort = null,
        [FromQuery] string? select = null,
        [FromQuery] string? search = null,
        [FromQuery] string? searchFields = null,
        [FromQuery] string? expand = null)
    {
        var filters = filter?.Select(FilterDescriptor.TryParse).Where(f => f is not null).Cast<FilterDescriptor>().ToList() ?? [];
        var q = new GetPagedRowsQuery(tableName, page, size, filters, SortDescriptor.TryParse(sort),
            SelectDescriptor.TryParse(select), search, ParseList(searchFields), ParseList(expand));
        return ToResult(await _mediator.Send(q));
    }

    [HttpGet("{tableName}/{id:long}")]
    public async Task<IActionResult> GetById(
        string tableName, long id,
        [FromQuery] string? select = null,
        [FromQuery] string? expand = null)
    {
        var q = new GetRowByIdQuery(tableName, id, SelectDescriptor.TryParse(select), ParseList(expand));
        return ToResult(await _mediator.Send(q));
    }

    [HttpPost("{tableName}")]
    public async Task<IActionResult> Create(string tableName, [FromBody] Dictionary<string, object?> body)
        => ToResult(await _mediator.Send(new CreateRowCommand(tableName, body)));

    [HttpPut("{tableName}/{id:long}")]
    public async Task<IActionResult> Update(string tableName, long id, [FromBody] Dictionary<string, object?> body)
        => ToResult(await _mediator.Send(new UpdateRowCommand(tableName, id, body)));

    [HttpPatch("{tableName}/{id:long}")]
    public async Task<IActionResult> Patch(string tableName, long id, [FromBody] Dictionary<string, object?> body)
        => ToResult(await _mediator.Send(new PatchRowCommand(tableName, id, body)));

    [HttpDelete("{tableName}/{id:long}")]
    public async Task<IActionResult> Delete(string tableName, long id)
        => ToResult(await _mediator.Send(new DeleteRowCommand(tableName, id)));

    [HttpPut("{tableName}/access")]
    [Authorize(Roles = "Admin,WG")]
    public async Task<IActionResult> SetAccess(string tableName, [FromBody] SetTableAccessCommand command)
    {
        command.TableName = tableName;
        return ToResult(await _mediator.Send(command));
    }
}
