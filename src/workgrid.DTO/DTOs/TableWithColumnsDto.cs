using workgrid.Domain.Entities;
using workgrid.Domain.Enums;

namespace workgrid.DTO.DTOs;

public class TableColumnsDto
{
    public long Id { get; set; }
    public InputTypeEnum Type { get; set; }
    public string Name { get; set; } = null!;
    public bool IsVisible { get; set; }
    public int TableOrder { get; set; }
    public bool? IsFilter { get; set; }
    public long TableId { get; set; }     // FK
    public long? RealColumnId { get; set; }
    public long? RealTableId { get; set; }
    public string? FunctionText { get; set; }
    public ModalDesignDto? ModalDesignFk { get; set; } = new();
    public ColumnValidationConfigDto? ValidationFk { get; set; }
    public ColumnDesignConfig? DesignFk { get; set; } = new();
    public List<ColumnUIConfigDto>? UiFk { get; set; } = new List<ColumnUIConfigDto>();
    public List<ColumnDataConfigDto>? DataFk { get; set; } = new List<ColumnDataConfigDto>();
}


