
using System.ComponentModel.DataAnnotations;

namespace workgrid.DTO.DTOs;

public class CreateOrUpdateEventDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Start date is required.")]
    public DateTime Start { get; set; }

    [Required(ErrorMessage = "End date is required.")]
    public DateTime End { get; set; }

    [Required(ErrorMessage = "ClassName is required.")]
    [MaxLength(100, ErrorMessage = "ClassName cannot exceed 100 characters.")]
    public string ClassName { get; set; } = "bg-primary-subtle";

    [MaxLength(500, ErrorMessage = "Location cannot exceed 500 characters.")]
    public string? Location { get; set; }

    [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
    public string? Description { get; set; }

    public string? ProjectId { get; set; }

    [Required(ErrorMessage = "IsPublic is required.")]
    public bool IsPublic { get; set; }
    public string UserId { get; set; } = string.Empty;
}

