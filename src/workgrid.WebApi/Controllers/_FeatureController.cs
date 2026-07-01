using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace workgrid.WebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FeatureController : ControllerBase
{
}
