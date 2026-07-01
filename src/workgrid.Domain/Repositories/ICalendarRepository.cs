using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface ICalendarRepository
{
    Task<IEnumerable<CalendarEvent>> GetAllAsync(string? projectId, string currentUserId);

    Task<CalendarEvent?> GetByIdAsync(string id);

    Task AddAsync(CalendarEvent entity);

    Task UpdateAsync(CalendarEvent entity);

    Task DeleteAsync(CalendarEvent entity);

    Task SaveChangesAsync();
}