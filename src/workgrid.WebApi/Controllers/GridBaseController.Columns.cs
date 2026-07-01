using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.DTO.DTOs;
using workgrid.Application.Features.Columns.Commands.DeleteColumn;
using workgrid.Application.Features.Columns.Commands.PruneEmptyColumns;
using workgrid.Application.Features.Columns.Queries.GetEmptyColumns;

namespace workgrid.WebApi.Controllers;

// Kolon bakım işlemleri: boş kolonları bulma/temizleme, ada göre silme.
public partial class GridBaseController
{
    [HttpGet("tables/{id:long}/empty-columns")]
    [Authorize(Roles = "Admin,WG")]
    public async Task<IActionResult> GetEmptyColumns(long id)
        => ToResult(await _mediator.Send(new GetEmptyColumnsQuery(id)));

    [HttpDelete("tables/{id:long}/empty-columns")]
    [Authorize(Roles = "Admin,WG")]
    public async Task<IActionResult> PruneEmptyColumns(long id, [FromBody] PruneColumnsRequest? request)
        => ToResult(await _mediator.Send(new PruneEmptyColumnsCommand(id, request?.ColumnIds)));

    [HttpDelete("{tableName}/columns/{columnName}")]
    public async Task<IActionResult> DeleteColumn(string tableName, string columnName, [FromQuery] bool hard = true)
        => ToResult(await _mediator.Send(new DeleteColumnCommand(tableName, columnName, hard)));
}
