using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;
using workgrid.Domain.Interfaces;
using workgrid.Infrastructure.Persistence.Common.Repositories;
using workgrid.Infrastructure.Persistence;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class KanbanCardRepository : BaseRepository<KanbanCard, Guid>, IKanbanCardRepository
{
    private readonly WorkGridDbContext _db;

    public KanbanCardRepository(WorkGridDbContext db) : base(db)
    {
        _db = db;
    }
    public async Task<IEnumerable<KanbanCard>> GetByProjectAsync(
        Guid projectId, CancellationToken ct = default)
    {
        return await GetAll(
                card => card.ProjectId == projectId && card.DeletedAt == null,
                q => q.OrderBy(card => card.Status).ThenBy(card => card.Order)
            )
            .IgnoreQueryFilters()
            .Include(c => c.Badges)
            .Include(c => c.Members)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<KanbanCard?> GetByIdWithDetailsAsync(
        Guid id, CancellationToken ct = default)
    {
        return await _db.KanbanCards
            .Include(c => c.Badges)
            .Include(c => c.Members)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }
    public async Task ExecuteDeleteCardDetailsAsync(Guid cardId, CancellationToken ct)
    {
        await _db.KanbanCardBadges
            .Where(b => b.CardId == cardId)
            .ExecuteDeleteAsync(ct);

        await _db.KanbanCardMembers
            .Where(m => m.CardId == cardId)
            .ExecuteDeleteAsync(ct);
    }
    public async Task DeleteById(Guid Id, CancellationToken ct)
    {
        var entity = await _db.KanbanCards
            .IgnoreQueryFilters()
            .Where(pm => pm.Id == Id)
            .FirstOrDefaultAsync(ct);

        if (entity != null)
        {
            entity.IsHardDelete = true;
            _db.Remove(entity);
        }
    }

    public async Task MoveAsync(
        Guid cardId, KanbanStatus targetStatus, int newOrder, CancellationToken ct = default)
    {
        var card = await GetById(cardId, hasTracking: true);
        if (card is null) return;
        var siblings = await GetAll(
                c => c.ProjectId == card.ProjectId && c.Status == targetStatus && c.Order >= newOrder,
                null,
                Array.Empty<System.Linq.Expressions.Expression<Func<KanbanCard, object>>>()
            )
            .ToListAsync(ct);

        foreach (var s in siblings) s.Order++;

        card.Status = targetStatus;
        card.Order = newOrder;
        card.LastModifiedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateCardFieldsAsync(
     Guid cardId,
     string title, string? text, string? pictureUrl, int? progressPercent, DateTime? dueDate,
     KanbanStatus? status, PriorityStatus? priority,
     IEnumerable<string> badges, IEnumerable<string> memberUserIds,
     CancellationToken ct)
    {
        // 1. 🚀 ANA KART ALANLARINI SQL DÜZEYİNDE GÜNCELLE (Hafızayı/Tracker'ı kirletmez)
        await _db.KanbanCards
            .Where(c => c.Id == cardId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.Title, title)
                .SetProperty(c => c.Text, text)
                .SetProperty(c => c.PictureUrl, pictureUrl)
                .SetProperty(c => c.ProgressPercent, progressPercent)
                .SetProperty(c => c.DueDate, dueDate)
                .SetProperty(c => c.LastModifiedAt, DateTime.UtcNow)
                .SetProperty(c => c.Status, status)
                .SetProperty(c => c.Priority, priority)
            , ct);

        // 2. ESKİ DETAYLARI (BADGES & MEMBERS) SİL
        await ExecuteDeleteCardDetailsAsync(cardId, ct);

        // 3. YENİ ETİKETLERİ (BADGES) TOPLU EKLE
        if (badges != null && badges.Any())
        {
            var newBadges = badges.Select(label => new KanbanCardBadge { CardId = cardId, Label = label }).ToList();
            await _db.KanbanCardBadges.AddRangeAsync(newBadges, ct);
        }

        // 4. YENİ ÜYELERİ (MEMBERS) TOPLU EKLE
        if (memberUserIds != null && memberUserIds.Any())
        {
            var newMembers = memberUserIds.Select(uid => new KanbanCardMember { CardId = cardId, UserId = uid }).ToList();
            await _db.KanbanCardMembers.AddRangeAsync(newMembers, ct);
        }
    }
}