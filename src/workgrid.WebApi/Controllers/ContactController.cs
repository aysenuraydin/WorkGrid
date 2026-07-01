using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;

namespace WorkGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController(IContactService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ContactConfigDto>> Get() =>
        Ok(await service.GetAsync());

    [HttpPut]
    [Authorize(Roles = "WG")]
    public async Task<ActionResult<ContactConfigDto>> Upsert(ContactConfigDto dto) =>
        Ok(await service.UpsertAsync(dto));
}
