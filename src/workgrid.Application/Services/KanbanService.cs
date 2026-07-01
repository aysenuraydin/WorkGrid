using Microsoft.EntityFrameworkCore;
using workgrid.Application.Common.Services;
using workgrid.Domain.Common;
using workgrid.Application.Interfaces;
using workgrid.Application.Kanban.DTOs;
using workgrid.Application.Kanban.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;
using workgrid.Domain.Interfaces;

namespace workgrid.Application.Services;

public class KanbanService : BaseService<KanbanCard, Guid>, IKanbanService
{
    private readonly IKanbanCardRepository _cardRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityService _identityService;

    public KanbanService(
        IUnitOfWork unitOfWork,
        IKanbanCardRepository cardRepo,
        IRepository<KanbanCard, Guid> repository,
        IIdentityService identityService) : base(repository)
    {
        _cardRepo = cardRepo;
        _unitOfWork = unitOfWork;
        _identityService = identityService;
    }

    public async Task<IEnumerable<KanbanBoardDto>> GetBoardByProjectAsync(
            Guid projectId, CancellationToken ct = default)
    {
        var cards = await _cardRepo.GetByProjectAsync(projectId, ct);

        var allUserIds = cards
            .SelectMany(c => c.Members)
            .Select(m => m.UserId)
            .Distinct()
            .ToList();

        var userDetailsMap = await _identityService.GetUsersAsync(allUserIds, ct);
        var mappedCards = cards.Select(c => new KanbanCardDto(
            c.Id,
            c.Title,
            c.Text,
            c.PictureUrl,
            c.ProgressPercent,
            c.Views,
            c.Comments,
            c.Attachments,
            c.DueDate,
            c.Order,
            c.ProjectId,
            c.Status,
            c.Priority,
            Badges: c.Badges.Select(b => b.Label),

            Members: c.Members.Select(m =>
            {
                var hasDetails = userDetailsMap.TryGetValue(m.UserId, out var details);
                return new CardMemberDto(
                    m.UserId,
                    hasDetails ? details.FullName : "Bilinmeyen Kullanıcı",
                    hasDetails ? details.ProfilePictureUrl : null
                );
            }).ToList()
        )).ToList();

        var board = Enum.GetValues<KanbanStatus>()
            .Select(status => new KanbanBoardDto(
                StatusName: status.ToString(),
                StatusValue: (int)status,
                Cards: mappedCards.Where(c => c.Status == status).OrderBy(c => c.Order)
            ))
            .ToList();

        return board;
    }
    public async Task<KanbanCardDto?> GetCardByProjectAsync(Guid cardId, CancellationToken ct = default)
    {
        var card = await _cardRepo
                .GetAll()
                .Include(x => x.Badges)
                .Include(x => x.Members)
                .FirstOrDefaultAsync(c => c.Id == cardId);
        if (card == null) return null;

        var userIds = card.Members
            .Select(m => m.UserId)
            .Distinct()
            .ToList();

        var userDetailsMap = await _identityService.GetUsersAsync(userIds, ct);
        var cardDto = new KanbanCardDto(
            card.Id,
            card.Title,
            card.Text,
            card.PictureUrl,
            card.ProgressPercent,
            card.Views,
            card.Comments,
            card.Attachments,
            card.DueDate,
            card.Order,
            card.ProjectId,
            card.Status,
            card.Priority,
            Badges: card.Badges.Select(b => b.Label),
            Members: card.Members.Select(m =>
            {
                var hasDetails = userDetailsMap.TryGetValue(m.UserId, out var details);
                return new CardMemberDto(
                    m.UserId,
                    hasDetails ? details.FullName : "Bilinmeyen Kullanıcı",
                    hasDetails ? details.ProfilePictureUrl : null
                );
            }).ToList()
        );
        return cardDto;
    }

    public async Task<KanbanCardDto> CreateCardAsync(
        CreateCardRequest req, CancellationToken ct = default)
    {
        var existingCards = await _cardRepo.GetByProjectAsync(req.ProjectId, ct);
        var targetStatus = req.Status ?? KanbanStatus.New;

        var order = existingCards.Where(c => c.Status == targetStatus).Any()
            ? existingCards.Where(c => c.Status == targetStatus).Max(c => c.Order) + 1
            : 0;

        var card = new KanbanCard
        {
            ProjectId = req.ProjectId,
            Status = targetStatus,
            Priority = req.Priority ?? PriorityStatus.Medium,
            Title = req.Title,
            Text = req.Text,
            PictureUrl = req.PictureUrl,
            ProgressPercent = req.ProgressPercent,
            DueDate = req.DueDate,
            Order = order,
            Views = 0,
            Comments = 0,
            Attachments = 0,
            Badges = req.Badges.Select(b => new KanbanCardBadge { Label = b }).ToList(),
            Members = req.MemberUserIds.Select(uid => new KanbanCardMember { UserId = uid }).ToList(),
        };

        await _cardRepo.Create(card);
        await _unitOfWork.CommitAsync(ct);

        return MapCard(card);
    }
    public async Task<KanbanCardDto> UpdateCardAsync(
        Guid cardId, UpdateCardRequest req, CancellationToken ct = default)
    {
        var exists = await _cardRepo.GetById(cardId);
        if (exists == null)
            throw new KeyNotFoundException($"Card {cardId} not found.");

        await _cardRepo.UpdateCardFieldsAsync(
            cardId,
            req.Title, req.Text, req.PictureUrl, req.ProgressPercent, req.DueDate,
            req.Status, req.Priority,
            req.Badges, req.MemberUserIds,
            ct);

        await _unitOfWork.CommitAsync(ct);

        var updated = await _cardRepo.GetByIdWithDetailsAsync(cardId, ct)
            ?? throw new KeyNotFoundException($"Card {cardId} not found.");

        return MapCard(updated);
    }

    public async Task DeleteCardAsync(Guid cardId, CancellationToken ct = default)
    {
        _ = await _cardRepo.GetById(cardId)
            ?? throw new KeyNotFoundException($"Card {cardId} not found.");

        await _cardRepo.ExecuteDeleteCardDetailsAsync(cardId, ct);
        await _cardRepo.DeleteById(cardId);
        await _unitOfWork.CommitAsync(ct);
    }

    public async Task MoveCardAsync(
        Guid cardId, MoveCardRequest req, CancellationToken ct = default)
    {
        _ = await _cardRepo.GetById(cardId)
            ?? throw new KeyNotFoundException($"Card {cardId} not found.");

        await _cardRepo.MoveAsync(cardId, req.TargetStatus, req.NewOrder, ct);
    }

    private static KanbanCardDto MapCard(KanbanCard c) => new(
        c.Id,
        c.Title,
        c.Text,
        c.PictureUrl,
        c.ProgressPercent,
        c.Views,
        c.Comments,
        c.Attachments,
        c.DueDate,
        c.Order,
        c.ProjectId,
        c.Status,
        c.Priority,
        Badges: c.Badges.Select(b => b.Label),
        Members: c.Members.Select(m => new CardMemberDto(m.UserId, null, null))
    );
}