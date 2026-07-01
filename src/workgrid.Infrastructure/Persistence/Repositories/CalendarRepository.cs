using Microsoft.EntityFrameworkCore;
using workgrid.Infrastructure.Persistence.Common.Repositories;
using workgrid.Infrastructure.Persistence;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class CalendarRepository : BaseRepository<CalendarEvent, string>, ICalendarRepository
{
    private readonly WorkGridDbContext _db;

    public CalendarRepository(WorkGridDbContext db) : base(db)
    {
        _db = db;
    }
    public async Task<IEnumerable<CalendarEvent>> GetAllAsync(string? projectId, string currentUserId)
    {
        var query = _db.CalendarEvents.AsQueryable();

        if (!string.IsNullOrEmpty(projectId))
            query = query.Where(e => e.ProjectId == projectId);

        query = query.Where(e => e.IsPublic || e.UserId == currentUserId);

        return await query
            .OrderBy(e => e.Start)
            .ToListAsync();
    }

    public async Task<CalendarEvent?> GetByIdAsync(string id)
        => await _db.CalendarEvents.FindAsync(id);

    public async Task AddAsync(CalendarEvent entity)
        => await _db.CalendarEvents.AddAsync(entity);

    public Task UpdateAsync(CalendarEvent entity)
    {
        _db.CalendarEvents.Update(entity);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(CalendarEvent entity)
    {
        _db.CalendarEvents.Remove(entity);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
        => await _db.SaveChangesAsync();
}