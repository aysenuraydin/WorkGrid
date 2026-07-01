namespace workgrid.Application.Services.Interfaces;

public interface IUserService
{
    Task<object> UpdateProfileAsync(UpdateProfileRequest request);
    Task UpdatePasswordAsync(UpdatePasswordRequest request);
    Task UpdateUserRoleAsync(UpdateUserRoleRequest request);
    Task UpdateAvatarUrlAsync(UpdateAvatarUrlRequest request);

    Task<UserAllDetailResponse> GetUserDetailByIdAsync(string userId);
    Task<bool> UpdateProfileAsync(UpdateProfileDto dto);
    Task<bool> UpdateExperienceProfileAsync(UpdateExperienceProfileDto dto);
    Task<List<UserDetailResponse>> GetAllUsersWithRolesAsync();
    Task<List<UserDetailResponse>> GetUsersByRoleAsync(string roleName);
    Task DeleteUserByIdAsync(string userId);

    Task<bool> SetUserBlockedAsync(string userId, bool blocked);
}

