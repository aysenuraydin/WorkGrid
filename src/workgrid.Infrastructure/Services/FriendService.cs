using workgrid.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Identity;

public class FriendService : IFriendService
{
    private readonly UserManager<ApplicationUser> _userManager;
    public FriendService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<bool> SendFriendRequestAsync(string currentUserId, string targetUserId)
    {
        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        var targetUser = await _userManager.FindByIdAsync(targetUserId);

        if (currentUser == null || targetUser == null) return false;

        var result = await _userManager.AddClaimAsync(targetUser, new Claim("PendingRequest", currentUserId));
        return result.Succeeded;
    }

    public async Task<bool> AcceptFriendRequestAsync(string currentUserId, string requesterUserId)
    {
        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        var requesterUser = await _userManager.FindByIdAsync(requesterUserId);

        if (currentUser == null || requesterUser == null) return false;

        await _userManager.RemoveClaimAsync(currentUser, new Claim("PendingRequest", requesterUserId));

        await _userManager.AddClaimAsync(currentUser, new Claim("Friend", requesterUserId));
        await _userManager.AddClaimAsync(requesterUser, new Claim("Friend", currentUserId));

        return true;
    }
    public async Task<bool> CancelFriendRequestAsync(string currentUserId, string targetUserId)
    {
        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        var targetUser = await _userManager.FindByIdAsync(targetUserId);

        if (currentUser == null || targetUser == null) return false;

        var targetClaims = await _userManager.GetClaimsAsync(targetUser);
        var sentRequestClaim = targetClaims.FirstOrDefault(c => c.Type == "PendingRequest" && c.Value == currentUserId);

        if (sentRequestClaim != null)
        {
            var result = await _userManager.RemoveClaimAsync(targetUser, sentRequestClaim);
            return result.Succeeded;
        }

        var myClaims = await _userManager.GetClaimsAsync(currentUser);
        var receivedRequestClaim = myClaims.FirstOrDefault(c => c.Type == "PendingRequest" && c.Value == targetUserId);

        if (receivedRequestClaim != null)
        {
            var result = await _userManager.RemoveClaimAsync(currentUser, receivedRequestClaim);
            return result.Succeeded;
        }
        return false;
    }

    public async Task<List<UserFriendDto>> GetUserFriendsAsync(string userId)
    {
        var friends = await _userManager.GetUsersForClaimAsync(new Claim("Friend", userId));
        var friendDtos = friends.Select(user => new UserFriendDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            ProfilePictureUrl = user.ProfilePictureUrl,
            JobTitle = user.JobTitle,
            CompanyName = user.CompanyName
        }).ToList();
        return friendDtos;
    }
}