using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace YourApp.Api.Controllers
{
    [ApiController]
    [Route("api/menu-snapshot")]
    [Authorize(Roles = "WG")]
    public class MenuSnapshotController : ControllerBase
    {
        private readonly MenuSnapshotService _service;

        public MenuSnapshotController(MenuSnapshotService service)
        {
            _service = service;
        }

        [HttpPost("save")]
        public async Task<IActionResult> Save()
        {
            var savedBy = User?.Identity?.Name;
            var result = await _service.SaveAsync(savedBy);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _service.GetAsync();
            return Ok(result);
        }

        [HttpPost("restore")]
        public async Task<IActionResult> Restore()
        {
            var result = await _service.RestoreAsync();
            if (!result.Success)
                return BadRequest(new { message = "Kaydedilmiş yedek bulunamadı." });
            return Ok(result);
        }
    }
}