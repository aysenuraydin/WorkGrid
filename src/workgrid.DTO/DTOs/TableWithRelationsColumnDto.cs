
using workgrid.Domain.Enums;

namespace workgrid.DTO.DTOs;

public class TableWithRelationsColumnDto
{
    public long Id { get; set; }
    public int? TableOrder { get; set; }
    public string Name { get; set; } = null!;
    public InputTypeEnum Type { get; set; }
    public long TableId { get; set; }
    public long? RealColumnId { get; set; }
    public long? RealTableId { get; set; }
    public string? RealTableName { get; set; }
}

