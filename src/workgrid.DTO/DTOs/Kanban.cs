using System.Globalization;
using workgrid.Domain.Enums;
using workgrid.Domain.Enums;

namespace workgrid.Application.Kanban.DTOs;

public record CardMemberDto(
    string UserId,
    string? FullName,
    string? ProfilePictureUrl
);

public record KanbanCardDto(
    Guid Id,
    string Title,
    string? Text,
    string? PictureUrl,
    int? ProgressPercent,
    int Views,
    int Comments,
    int Attachments,
    DateTime? DueDate,
    int Order,
    Guid ProjectId,
    KanbanStatus Status,
    PriorityStatus Priority,
    IEnumerable<string> Badges,
    IEnumerable<CardMemberDto> Members
);

public record KanbanBoardDto(
    string StatusName,
    int StatusValue,
    IEnumerable<KanbanCardDto> Cards
);

// ─── Request DTOs ─────────────────────────────────────────────────────────────

public record CreateCardRequest(
    Guid ProjectId,
    string Title,
    KanbanStatus? Status = null,
    PriorityStatus? Priority = null,
    string? Text = null,
    string? PictureUrl = null,
    int? ProgressPercent = null,
    DateTime? DueDate = null,
    IEnumerable<string>? Badges = null,
    IEnumerable<string>? MemberUserIds = null
)
{
    public IEnumerable<string> Badges { get; init; } = Badges ?? [];
    public IEnumerable<string> MemberUserIds { get; init; } = MemberUserIds ?? [];
}

public record UpdateCardRequest(
    string Title,
    KanbanStatus? Status = null,
    PriorityStatus? Priority = null,
    string? Text = null,
    string? PictureUrl = null,
    int? ProgressPercent = null,
    DateTime? DueDate = null,
    IEnumerable<string>? Badges = null,
    IEnumerable<string>? MemberUserIds = null
)
{
    public IEnumerable<string> Badges { get; init; } = Badges ?? [];
    public IEnumerable<string> MemberUserIds { get; init; } = MemberUserIds ?? [];
}

public record MoveCardRequest(KanbanStatus TargetStatus, int NewOrder);


public record ProjectDto(
    Guid Id,
    string Name,
    string? Description,
    ProjectStatus Status,
    PriorityStatus Priority,
    IEnumerable<ProjectMemberDto> Members,
    int CardCounts
);

public record ProjectMemberDto(
    string UserId,
    string FullName,
    string? ProfilePictureUrl
);

public record CreateProjectRequest(
    string Name,
    string? Description,
    ProjectStatus Status,
    PriorityStatus Priority,
    IEnumerable<string>? MemberUserIds = null
);

public record UpdateProjectRequest(
    string Name,
    string? Description,
    ProjectStatus Status,
    PriorityStatus Priority,
    IEnumerable<string> MemberUserIds
);