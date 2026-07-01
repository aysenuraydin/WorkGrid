namespace workgrid.Domain.Enums;

public enum KanbanStatus
{
    New = 1,
    Pending = 2,
    InProgress = 3,
    Review = 4,
    Completed = 5,
}

public enum ProjectStatus
{
    Planning = 1,
    New = 2,
    Pending = 3,
    InProgress = 4,
    Review = 5,
    OnHold = 6,
    Completed = 7,
    Cancelled = 8,
    Archived = 9,
}

public enum PriorityStatus
{
    Low = 1,
    Medium = 2,
    High = 3
}