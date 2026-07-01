using workgrid.Domain.Common;
using workgrid.Application.Kanban.DTOs;
using workgrid.Domain.Entities;
namespace workgrid.Application.Kanban.Interfaces;

public interface IKanbanService : IService<KanbanCard, Guid>
{
    Task<IEnumerable<KanbanBoardDto>> GetBoardByProjectAsync(
    Guid projectId, CancellationToken ct = default);
    Task<KanbanCardDto?> GetCardByProjectAsync(
    Guid cardId, CancellationToken ct = default);

    Task<KanbanCardDto> CreateCardAsync(CreateCardRequest req, CancellationToken ct = default);
    Task<KanbanCardDto> UpdateCardAsync(Guid cardId, UpdateCardRequest req, CancellationToken ct = default);
    Task DeleteCardAsync(Guid cardId, CancellationToken ct = default);
    Task MoveCardAsync(Guid cardId, MoveCardRequest req, CancellationToken ct = default);
}