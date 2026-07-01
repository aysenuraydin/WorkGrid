using workgrid.Domain.Common;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;

namespace workgrid.Domain.Interfaces;

public interface IKanbanCardRepository : IRepository<KanbanCard, Guid>
{
    Task<IEnumerable<KanbanCard>> GetByProjectAsync(Guid projectId, CancellationToken ct = default);
    Task<KanbanCard?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    Task MoveAsync(Guid cardId, KanbanStatus targetStatus, int newOrder, CancellationToken ct = default);
    Task ExecuteDeleteCardDetailsAsync(Guid cardId, CancellationToken ct);
    Task UpdateCardFieldsAsync(
        Guid cardId,
        string title, string? text, string? pictureUrl, int? progressPercent, DateTime? dueDate,
        KanbanStatus? status, PriorityStatus? priority,
        IEnumerable<string> badges, IEnumerable<string> memberUserIds,
        CancellationToken ct);
}
