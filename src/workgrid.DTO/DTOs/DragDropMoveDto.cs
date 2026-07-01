
using System.ComponentModel.DataAnnotations;
namespace workgrid.DTO.DTOs;

public class DragDropMoveDto
{
    [Required(ErrorMessage = "Start date is required.")]
    public DateTime Start { get; set; }

    [Required(ErrorMessage = "End date is required.")]
    public DateTime End { get; set; }
}