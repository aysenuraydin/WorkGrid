using workgrid.Domain.Enums;
namespace workgrid.DTO.DTOs;

public class RulesValidationConfigDto
{
    public ValidationRuleEnum Rule { get; set; }
    public bool? IsActive { get; set; }
    public string? Value { get; set; }
    public string? Message { get; set; }
}

