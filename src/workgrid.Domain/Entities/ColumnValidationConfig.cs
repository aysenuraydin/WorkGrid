using workgrid.Domain.Common;
using workgrid.Domain.Enums;
namespace workgrid.Domain.Entities;

public class ColumnValidationConfig : BaseAuditableEntity<long>
{
    public long ColumnId { get; set; }
    public FieldTypeEnum Type { get; set; }
    public List<RulesValidationConfig> Rules { get; set; } = new();
};