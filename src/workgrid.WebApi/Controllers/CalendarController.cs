using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CalendarController : ControllerBase
    {
        private readonly ICalendarService _calendarService;

        public CalendarController(ICalendarService calendarService)
        {
            _calendarService = calendarService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CalendarEventDto>>> GetEvents(
            [FromQuery] string? projectId)
        {
            var events = await _calendarService.GetEventsAsync(projectId);
            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CalendarEventDto>> GetEvent(string id)
        {
            try
            {
                var dto = await _calendarService.GetEventByIdAsync(id);
                if (dto is null) return NotFound("Event not found.");
                return Ok(dto);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<CalendarEventDto>> CreateEvent(
            [FromBody] CreateOrUpdateEventDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var created = await _calendarService.CreateEventAsync(dto);
                return CreatedAtAction(nameof(GetEvent), new { id = created.Id }, created);
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(
            string id,
            [FromBody] CreateOrUpdateEventDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                await _calendarService.UpdateEventAsync(id, dto);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPatch("{id}/move")]
        public async Task<IActionResult> MoveEvent(
            string id,
            [FromBody] DragDropMoveDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                await _calendarService.MoveEventAsync(id, dto);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(string id)
        {
            try
            {
                await _calendarService.DeleteEventAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}