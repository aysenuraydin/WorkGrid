using workgrid.Domain.Common;
using workgrid.Domain.Enums;
namespace workgrid.Domain.Entities;

public class ColumnUIConfig : BaseAuditableEntity<long>
{
    public long ColumnId { get; set; }
    public string? Value { get; set; } = null!;
    public AttributeEnum Type { get; set; }
};