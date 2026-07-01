
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface ICalendarService
{
    Task<IEnumerable<CalendarEventDto>> GetEventsAsync(string? projectId);
    Task<CalendarEventDto?> GetEventByIdAsync(string id);
    Task<CalendarEventDto> CreateEventAsync(CreateOrUpdateEventDto dto);
    Task UpdateEventAsync(string id, CreateOrUpdateEventDto dto);
    Task MoveEventAsync(string id, DragDropMoveDto dto);
    Task DeleteEventAsync(string id);
}