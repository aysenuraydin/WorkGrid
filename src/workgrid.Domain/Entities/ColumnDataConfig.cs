using workgrid.Domain.Common;
using workgrid.Domain.Enums;

namespace workgrid.Domain.Entities;

public class ColumnDataConfig : BaseAuditableEntity<long>
{
    public long ColumnId { get; set; }
    public string? Value { get; set; } = null!;
    public PropertyEnum Type { get; set; }
};