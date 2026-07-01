using MediatR;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Common.Models;

namespace workgrid.WebApi.Controllers;

[Route("api/gridbase")]
public partial class GridBaseController : ControllerBase
{
    private readonly IMediator _mediator;
    public GridBaseController(IMediator mediator) => _mediator = mediator;

    private IActionResult ToResult<T>(Result<T> r)
    {
        if (r.Succeeded) return Ok(r);

        var msg = (r.Errors != null && r.Errors.Any()) ? string.Join("; ", r.Errors) : "";
        if (msg.Contains("bulunamadı", StringComparison.OrdinalIgnoreCase))
            return NotFound(r);
        return BadRequest(r);
    }

    private static List<string>? ParseList(string? csv)
    {
        if (string.IsNullOrWhiteSpace(csv)) return null;
        return csv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
    }
}
