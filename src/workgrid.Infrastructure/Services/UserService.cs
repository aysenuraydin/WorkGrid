using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using workgrid.Application.Services.Interfaces;
using workgrid.Infrastructure.Identity;

namespace workgrid.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public UserService(UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor)
    {
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task DeleteUserByIdAsync(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException($"User with ID {userId} not found.");
        }
        var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == userId)
        {
            throw new InvalidOperationException("You cannot delete your own account while logged in.");
        }

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"Failed to delete user: {errors}");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdStr = _httpContextAccessor.HttpContext?.User?.FindFirst("id")?.Value
                        ?? _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                        ?? _httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out Guid userId))
        {
            var isAuthenticated = _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated;
            Console.WriteLine($"[AUTH LOG] IsAuthenticated: {isAuthenticated}, Extracted UserId: {userIdStr}");

            throw new Exception("Unauthorized process! User session not found.");
        }

        return userId;
    }

    public async Task<object> UpdateProfileAsync(UpdateProfileRequest request)
    {
        var userId = GetCurrentUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) throw new Exception("User not found.");

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.UserName = request.Username;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) throw new Exception("Profile update failed.");

        return new { user.Id, user.UserName, user.Email, user.FirstName, user.LastName, user.ProfilePictureUrl };
    }
    public async Task<bool> UpdateExperienceProfileAsync(UpdateExperienceProfileDto request)
    {
        if (request == null || string.IsNullOrEmpty(request.Id))
        {
            return false;
        }

        // 1. Kullanıcıyı veritabanından getir
        var user = await _userManager.FindByIdAsync(request.Id);
        if (user == null)
        {
            return false;
        }

        user.JobTitle = request.JobTitle;
        user.CompanyName = request.CompanyName;
        user.ExperienceYears = request.ExperienceYears;
        user.JobDescription = request.JobDescription;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) throw new Exception("Profile update failed.");

        return true;
    }

    public async Task UpdatePasswordAsync(UpdatePasswordRequest request)
    {
        if (request.NewPassword != request.ConfirmNewPassword)
            throw new Exception("New passwords do not match.");

        var userId = GetCurrentUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) throw new Exception("User not found.");

        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded) throw new Exception("Password update failed. Check your current password.");
    }

    public async Task UpdateUserRoleAsync(UpdateUserRoleRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user == null) throw new Exception("Target user not found.");

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, request.NewRole);
    }

    public async Task UpdateAvatarUrlAsync(UpdateAvatarUrlRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null) throw new Exception("User not found.");

        user.ProfilePictureUrl = request.ProfilePictureUrl;
        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"Failed to update profile picture: {errors}");
        }
    }

    public async Task<UserAllDetailResponse> GetUserDetailByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) throw new Exception("User not found.");

        var roles = await _userManager.GetRolesAsync(user);

        return new UserAllDetailResponse
        {
            Id = user.Id,
            FirstName = user.FirstName ?? "",
            LastName = user.LastName ?? "",
            Username = user.UserName ?? "",
            Email = user.Email ?? "",
            PhoneNumber = user.PhoneNumber ?? "",
            ProfilePictureUrl = user.ProfilePictureUrl,
            Roles = roles.ToList(),

            Designation = user.Designation,
            Website = user.Website,
            City = user.City,
            Country = user.Country,
            ZipCode = user.ZipCode,
            Address = user.Address,
            Description = user.Description,
            JoiningDate = user.JoiningDate,
            Skils = user.Skils,
            JobTitle = user.JobTitle,
            CompanyName = user.CompanyName,
            ExperienceYears = user.ExperienceYears,
            JobDescription = user.JobDescription
        };
    }
    public async Task<bool> UpdateProfileAsync(UpdateProfileDto dto)
    {
        var user = await _userManager.FindByIdAsync(dto.Id);
        if (user == null)
            return false;

        user.Email = dto.Email ?? user.Email;
        user.NormalizedEmail = dto.Email?.ToUpper() ?? user.NormalizedEmail;
        user.PhoneNumber = dto.PhoneNumber;

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Skils = dto.Skils;
        user.Designation = dto.Designation;
        user.Website = dto.Website;
        user.City = dto.City;
        user.Address = dto.Address;
        user.Country = dto.Country;
        user.ZipCode = dto.ZipCode;
        user.Description = dto.Description;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            Console.WriteLine(errors);
            return false;
        }
        return true;
    }

    public async Task<List<UserDetailResponse>> GetAllUsersWithRolesAsync()
    {
        var users = _userManager.Users.ToList();
        var responseList = new List<UserDetailResponse>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            responseList.Add(new UserDetailResponse
            {
                Id = user.Id,
                FirstName = user.FirstName ?? "",
                LastName = user.LastName ?? "",
                Username = user.UserName ?? "",
                Email = user.Email ?? "",
                ProfilePictureUrl = user.ProfilePictureUrl,
                Roles = roles.ToList(),
                LockoutEnd = user.LockoutEnd,
                IsBlocked = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow,
            });
        }

        return responseList;
    }

    public async Task<List<UserDetailResponse>> GetUsersByRoleAsync(string roleName)
    {
        var usersInRole = await _userManager.GetUsersInRoleAsync(roleName);
        var responseList = new List<UserDetailResponse>();

        foreach (var user in usersInRole)
        {
            responseList.Add(new UserDetailResponse
            {
                Id = user.Id,
                FirstName = user.FirstName ?? "",
                LastName = user.LastName ?? "",
                Username = user.UserName ?? "",
                Email = user.Email ?? "",
                ProfilePictureUrl = user.ProfilePictureUrl,
                Roles = new List<string> { roleName }
            });
        }

        return responseList;
    }
    public async Task<bool> SetUserBlockedAsync(string userId, bool blocked)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found.");

        var currentUserId = _httpContextAccessor.HttpContext?.User?
            .FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == userId)
            throw new InvalidOperationException("Kendi hesabınızı bloklayamazsınız.");

        await _userManager.SetLockoutEnabledAsync(user, true);

        var lockoutEnd = blocked ? DateTimeOffset.MaxValue : (DateTimeOffset?)null;
        var result = await _userManager.SetLockoutEndDateAsync(user, lockoutEnd);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"Block/unblock failed: {errors}");
        }

        return blocked;
    }

}