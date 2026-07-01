namespace workgrid.Application.Services.Interfaces;

public interface IRoleService
{
    Task<List<RoleResponse>> GetRolesAsync();
    Task CreateRoleAsync(CreateRoleRequest request);
    Task UpdateRoleAsync(UpdateRoleRequest request);
    Task DeleteRoleAsync(string id);
}

public class RoleResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class CreateRoleRequest
{
    public string Name { get; set; } = string.Empty;
}

public class UpdateRoleRequest
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}