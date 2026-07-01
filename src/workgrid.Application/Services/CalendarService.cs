using workgrid.Application.Common.Services;
using workgrid.Application.Interfaces;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Common;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public class CalendarService : BaseService<CalendarEvent, string>, ICalendarService
{
    private readonly ICalendarRepository _repository;
    private readonly IIdentityService _identityService;

    public CalendarService(
        ICalendarRepository calendarRepo,
        IRepository<CalendarEvent, string> repository,
        IIdentityService identityService) : base(repository)
    {
        _repository = calendarRepo;
        _identityService = identityService;
    }

    public async Task<IEnumerable<CalendarEventDto>> GetEventsAsync(string? projectId)
    {
        var currentUserId = _identityService.GetUserId();

        var events = await _repository.GetAllAsync(projectId, currentUserId);

        return events.Select(e => new CalendarEventDto
        {
            Id = e.Id,
            Title = e.Title,
            Start = e.Start,
            End = e.End,
            ClassName = e.ClassName,
            Location = e.Location,
            Description = e.Description,
            ProjectId = e.ProjectId,
            IsPublic = e.IsPublic,
            UserId = e.UserId
        });
    }

    public async Task<CalendarEventDto?> GetEventByIdAsync(string id)
    {
        var e = await _repository.GetByIdAsync(id);
        if (e is null) return null;

        var currentUserId = _identityService.GetUserId();

        if (!e.IsPublic && e.UserId != currentUserId)
            throw new UnauthorizedAccessException("You do not have permission to view this event.");

        return new CalendarEventDto
        {
            Id = e.Id,
            Title = e.Title,
            Start = e.Start,
            End = e.End,
            ClassName = e.ClassName,
            Location = e.Location,
            Description = e.Description,
            ProjectId = e.ProjectId,
            IsPublic = e.IsPublic,
            UserId = e.UserId
        };
    }

    public async Task<CalendarEventDto> CreateEventAsync(CreateOrUpdateEventDto dto)
    {
        var currentUserId = _identityService.GetUserId();
        var isAdmin = await _identityService.IsInRoleAsync(currentUserId, "Admin");

        if (dto.IsPublic && !isAdmin)
            throw new UnauthorizedAccessException("Only administrators can create public events.");

        var entity = new CalendarEvent
        {
            Title = dto.Title,
            Start = dto.Start,
            End = dto.End,
            ClassName = dto.ClassName,
            Location = dto.Location,
            Description = dto.Description,
            ProjectId = dto.ProjectId,
            IsPublic = dto.IsPublic,
            UserId = currentUserId
        };

        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();

        return new CalendarEventDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Start = entity.Start,
            End = entity.End,
            ClassName = entity.ClassName,
            Location = entity.Location,
            Description = entity.Description,
            ProjectId = entity.ProjectId,
            IsPublic = entity.IsPublic,
            UserId = entity.UserId
        };
    }

    public async Task UpdateEventAsync(string id, CreateOrUpdateEventDto dto)
    {
        var entity = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Event '{id}' not found.");

        var currentUserId = _identityService.GetUserId();
        var isAdmin = await _identityService.IsInRoleAsync(currentUserId, "Admin") ||
                await _identityService.IsInRoleAsync(currentUserId, "WG");

        if (entity.IsPublic && !isAdmin)
            throw new UnauthorizedAccessException("Only administrators can update public events.");

        if (!entity.IsPublic && entity.UserId != currentUserId && !isAdmin)
            throw new UnauthorizedAccessException("You do not have permission to update this event.");

        if (dto.IsPublic && !isAdmin)
            throw new UnauthorizedAccessException("Only administrators can make an event public.");

        entity.Title = dto.Title;
        entity.Start = dto.Start;
        entity.End = dto.End;
        entity.ClassName = dto.ClassName;
        entity.Location = dto.Location;
        entity.Description = dto.Description;
        entity.ProjectId = dto.ProjectId;
        entity.IsPublic = dto.IsPublic;

        await _repository.UpdateAsync(entity);
        await _repository.SaveChangesAsync();
    }

    public async Task MoveEventAsync(string id, DragDropMoveDto dto)
    {
        var entity = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Event '{id}' not found.");

        var currentUserId = _identityService.GetUserId();
        var isAdmin = await _identityService.IsInRoleAsync(currentUserId, "Admin");

        if (entity.IsPublic && !isAdmin)
            throw new UnauthorizedAccessException("Only administrators can move public events.");

        if (!entity.IsPublic && entity.UserId != currentUserId && !isAdmin)
            throw new UnauthorizedAccessException("You do not have permission to move this event.");

        entity.Start = dto.Start;
        entity.End = dto.End;

        await _repository.UpdateAsync(entity);
        await _repository.SaveChangesAsync();
    }

    public async Task DeleteEventAsync(string id)
    {
        var entity = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Event '{id}' not found.");

        var currentUserId = _identityService.GetUserId();
        var isAdmin = await _identityService.IsInRoleAsync(currentUserId, "Admin");

        if (entity.IsPublic && !isAdmin)
            throw new UnauthorizedAccessException("Only administrators can delete public events.");

        if (!entity.IsPublic && entity.UserId != currentUserId && !isAdmin)
            throw new UnauthorizedAccessException("You do not have permission to delete this event.");

        await _repository.DeleteAsync(entity);
        await _repository.SaveChangesAsync();
    }
}