using workgrid.Domain.Enums;

namespace workgrid.Domain.Entities;

public class TableAccessDto
{
    public long Id { get; set; }
    public AccessLevel ReadAccess { get; set; }
    public AccessLevel WriteAccess { get; set; }
    public string? ReadRequiredRole { get; set; }
    public string? WriteRequiredRole { get; set; }
    public bool IsOwnerScoped { get; set; }
    public string? OwnerColumn { get; set; }
}