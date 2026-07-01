namespace workgrid.DTO.DTOs;

public class MenuItemSnapshotDto
{
    public long Id { get; set; }
    public long? ParentId { get; set; }
    public string Label { get; set; } = "";
    public string? Link { get; set; }
    public string? Icon { get; set; }
    public int? Order { get; set; }
    public bool Visible { get; set; }
    public bool IsHeader { get; set; }
    public bool IsAdmin { get; set; }

    public bool Locked { get; set; }

    public string BadgeName { get; set; } = null!;
    public string BadgeColor { get; set; } = null!;
}

public class SaveMenuSnapshotResult
{
    public bool Success { get; set; }
    public int ItemCount { get; set; }
    public DateTime SavedAt { get; set; }
}

public class GetMenuSnapshotResult
{
    public bool Exists { get; set; }
    public List<MenuItemSnapshotDto> Items { get; set; } = new();
    public DateTime? SavedAt { get; set; }
}

public class RestoreMenuSnapshotResult
{
    public bool Success { get; set; }
    public int RestoredCount { get; set; }
}