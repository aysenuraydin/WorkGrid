using workgrid.Domain.Common;
using workgrid.Domain.Enums;
namespace workgrid.Domain.Entities;

public class RulesValidationConfig : BaseAuditableEntity<long>
{
    public long ColumnValidationConfigId { get; set; }
    public ValidationRuleEnum Rule { get; set; }
    public bool? IsActive { get; set; }
    public string? Value { get; set; }
    public string? Message { get; set; }
};