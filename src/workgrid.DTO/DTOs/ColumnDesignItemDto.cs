namespace workgrid.DTO.DTOs;

public class ColumnDesignItemDto
{
    public long Id { get; set; }
    public int? Order { get; set; }
    public int? Width { get; set; }
    public int? SpaceTop { get; set; }
    public int? SpaceBottom { get; set; }
    public int? SpaceLeft { get; set; }
    public int? SpaceRight { get; set; }
    public bool? IsVisible { get; set; }
    public int? X { get; set; }
    public int? Y { get; set; }
    public bool? IsMove { get; set; }
}