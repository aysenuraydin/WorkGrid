using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Interceptors;

public class AuditableEntityInterceptor : SaveChangesInterceptor
{
    private readonly IUser _currentUser;
    private readonly TimeProvider _dateTime;

    public AuditableEntityInterceptor(IUser currentUser, TimeProvider dateTime)
    {
        _currentUser = currentUser;
        _dateTime = dateTime;
    }

    private string? CurrentUserLabel
    {
        get
        {
            var username = _currentUser.Username;
            var role = _currentUser.Role;

            if (string.IsNullOrWhiteSpace(username))
                return _currentUser.Id;

            return string.IsNullOrWhiteSpace(role)
                ? username
                : $"{role} - {username}";
        }
    }

    private string? CurrentUserId => _currentUser.Id;

    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void UpdateEntities(DbContext context)
    {
        if (context == null) return;

        var label = CurrentUserLabel;
        var userId = CurrentUserId;

        var entries = context.ChangeTracker.Entries<IAuditableEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                continue;

            if (entry.State == EntityState.Added)
            {
                entry.Property(o => o.CreatedAt).CurrentValue = DateTime.UtcNow;
                entry.Property(o => o.CreatedBy).CurrentValue = label;
                entry.Property(o => o.CreatedByUserId).CurrentValue = userId;
            }
            else if (entry.State == EntityState.Modified || entry.HasChangedOwnedEntities())
            {
                entry.Property(o => o.LastModifiedAt).CurrentValue = DateTime.UtcNow;
                entry.Property(o => o.LastModifiedBy).CurrentValue = label;
                entry.Property(o => o.LastModifiedByUserId).CurrentValue = userId;
            }
            else if (entry.State == EntityState.Deleted || (
                    entry.State == EntityState.Modified &&
                    entry.Property(o => o.DeletedAt).CurrentValue != null &&
                    entry.Property(o => o.DeletedAt).OriginalValue == null))
            {
                if (entry.Entity.IsHardDelete) continue;

                entry.Property(o => o.DeletedAt).CurrentValue = DateTime.UtcNow;
                entry.Property(o => o.DeletedBy).CurrentValue = label;
                entry.Property(o => o.DeletedByUserId).CurrentValue = userId;
                entry.State = EntityState.Modified;
            }
        }

        var deletedEntries = context.ChangeTracker.Entries<IAuditableEntity>()
            .Where(e => e.State == EntityState.Modified &&
                        e.Property(o => o.DeletedAt).CurrentValue != null &&
                        e.Property(o => o.DeletedAt).OriginalValue == null)
            .ToList();

        foreach (var entry in deletedEntries)
        {
            if (entry.Entity is Datatable table)
            {
                foreach (var col in table.ColumnsFk ?? new List<TableColumn>())
                {
                    col.DeletedAt = DateTime.UtcNow;
                    col.DeletedBy = label;
                    col.DeletedByUserId = userId;
                    context.Entry(col).State = EntityState.Modified;

                    foreach (var cell in col.CellsFk ?? new List<TableCell>())
                    {
                        cell.DeletedAt = DateTime.UtcNow;
                        cell.DeletedBy = label;
                        cell.DeletedByUserId = userId;
                        context.Entry(cell).State = EntityState.Modified;
                    }
                }
            }

            if (entry.Entity is TableColumn column)
            {
                foreach (var cell in column.CellsFk ?? new List<TableCell>())
                {
                    cell.DeletedAt = DateTime.UtcNow;
                    cell.DeletedBy = label;
                    cell.DeletedByUserId = userId;
                    context.Entry(cell).State = EntityState.Modified;
                }
            }
        }
    }
}

public static class EntityExentions
{
    public static bool HasChangedOwnedEntities(this EntityEntry entity) =>
        entity.References.Any(r =>
        r.TargetEntry != null &&
        r.TargetEntry.Metadata.IsOwned() &&
        (r.TargetEntry.State == EntityState.Added || r.TargetEntry.State == EntityState.Modified));
}