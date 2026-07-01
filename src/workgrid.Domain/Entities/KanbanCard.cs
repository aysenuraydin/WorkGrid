using workgrid.Domain.Common;
using workgrid.Domain.Enums;
using workgrid.Domain.Enums;

namespace workgrid.Domain.Entities;

public class KanbanCard : BaseAuditableEntity<Guid>
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Text { get; set; }
    public string? PictureUrl { get; set; }

    public int? ProgressPercent { get; set; }
    public int Views { get; set; }
    public int Comments { get; set; }
    public int Attachments { get; set; }

    public DateTime? DueDate { get; set; }
    public int Order { get; set; }

    public KanbanStatus Status { get; set; } = KanbanStatus.New;

    public PriorityStatus Priority { get; set; } = PriorityStatus.Medium;
    public Guid ProjectId { get; set; }

    public ICollection<KanbanCardBadge> Badges { get; set; } = new List<KanbanCardBadge>();
    public ICollection<KanbanCardMember> Members { get; set; } = new List<KanbanCardMember>();
}
public class KanbanCardBadge : IEntity<Guid>
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Label { get; set; } = string.Empty;
    public Guid CardId { get; set; }
    public KanbanCard Card { get; set; } = null!;
}
public class KanbanCardMember : IEntity<Guid>
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } = string.Empty;
    public Guid CardId { get; set; }
    public KanbanCard Card { get; set; } = null!;
}


public class Project : BaseAuditableEntity<Guid>
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ProjectStatus Status { get; set; } = ProjectStatus.Planning;

    public PriorityStatus Priority { get; set; } = PriorityStatus.Medium;

    public ICollection<KanbanCard> Cards { get; set; } = new List<KanbanCard>();

    public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
}

public class ProjectMember : BaseAuditableEntity<Guid>
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;
}