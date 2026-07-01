using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;


public class ContactConfig
{
    public int Id { get; set; }
    public string Address1 { get; set; } = string.Empty;
    public string Address2 { get; set; } = string.Empty;
    public string WorkingHours { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}
