using workgrid.Domain.Enums;

namespace workgrid.DTO.DTOs;

public record SetTableAccessRequest(
    AccessLevel ReadAccess,
    AccessLevel WriteAccess,
    string? ReadRequiredRole = null,
    string? WriteRequiredRole = null,
    bool IsOwnerScoped = false,
    string? OwnerColumn = null);


