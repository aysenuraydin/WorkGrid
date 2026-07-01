namespace workgrid.DTO.DTOs;

public class TableSchemaResponse
{
    public string Table { get; set; } = null!;
    public List<ColumnSchemaDto> Columns { get; set; } = new();
}

public class ColumnSchemaDto
{
    public string Key { get; set; } = null!;
    public string Label { get; set; } = null!;
    public string Type { get; set; } = null!;
    public object? Default { get; set; }
    public bool IsForeign { get; set; }
    public bool IsSelf { get; set; }
    public bool IsMultiSelect { get; set; }
    public string? RelatedTable { get; set; }
}