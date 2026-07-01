namespace workgrid.DTO.DTOs;

public class CalendarEventDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public DateTime Start { get; set; }
    public DateTime? End { get; set; }
    public string ClassName { get; set; } = "bg-primary-subtle";
    public string? Location { get; set; }
    public string? Description { get; set; }
    public string? ProjectId { get; set; }
    public bool IsPublic { get; set; }
    public string? UserId { get; set; }
}
