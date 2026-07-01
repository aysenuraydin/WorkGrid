using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using workgrid.Application.Common.Interfaces;

namespace workgrid.Infrastructure.Services;

public class CurrentUser : IUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public string? Id =>
        User?.FindFirstValue(ClaimTypes.NameIdentifier);

    public string? Username =>
        User?.FindFirstValue(ClaimTypes.Name)
        ?? User?.FindFirstValue("unique_name")
        ?? User?.FindFirstValue("username")
        ?? User?.FindFirstValue("name");

    // Role: ClaimTypes.Role (birden fazla rol varsa ilki).
    public string? Role =>
        User?.FindFirstValue(ClaimTypes.Role)
        ?? User?.FindFirstValue("role");
}