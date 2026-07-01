namespace workgrid.Domain.Entities;

public class ModalDesign
{
    public int? Order { get; set; } = 0;
    public int? Width { get; set; } = 0;
    public int? SpaceTop { get; set; } = 0;
    public int? SpaceBottom { get; set; } = 0;
    public int? SpaceLeft { get; set; } = 0;
    public int? SpaceRight { get; set; } = 0;
    public bool? IsVisible { get; set; } = false;

    public int? X { get; set; } = 0;
    public int? Y { get; set; } = 0;
    public bool? IsMove { get; set; } = false;
}