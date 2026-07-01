namespace workgrid.Application.Interfaces;

public interface IIdentityService
{
    Task<bool> ValidateUsersExistAsync(IEnumerable<string> userIds, CancellationToken ct = default);
    Task<Dictionary<string, (string FirstName, string LastName, string? ProfilePictureUrl)>> GetUsersDetailsAsync(IEnumerable<string> userIds, CancellationToken ct = default);
    Task<Dictionary<string, (string FullName, string? ProfilePictureUrl)>> GetUsersAsync(
        List<string> userIds, CancellationToken ct = default);

    string GetUserId();
    Task<bool> IsInRoleAsync(string userId, string roleName);
}