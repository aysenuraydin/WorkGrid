using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;


public class SocialLink
{
    public int Id { get; set; }
    public string Platform { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}
