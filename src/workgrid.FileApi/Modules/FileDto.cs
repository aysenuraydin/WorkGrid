namespace workgrid.FileApi.Modules;

public class FileDto
{
    public string Name { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public byte[] Data { get; set; } = null!;
}