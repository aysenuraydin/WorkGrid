
using System.ComponentModel.DataAnnotations;
using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;

public class CalendarEvent : BaseEntity<string>, IEntity<string>
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = string.Empty;
    public DateTime Start { get; set; }
    public DateTime? End { get; set; }
    public string ClassName { get; set; } = "bg-primary-subtle";
    public string? Location { get; set; }
    public string? Description { get; set; }
    public string? ProjectId { get; set; }
    public bool IsPublic { get; set; } = false;
    public string UserId { get; set; } = string.Empty;

}

