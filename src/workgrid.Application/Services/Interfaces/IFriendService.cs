using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Identity;

public interface IFriendService
{
    Task<bool> SendFriendRequestAsync(string currentUserId, string targetUserId);
    Task<bool> AcceptFriendRequestAsync(string currentUserId, string requesterUserId);
    Task<bool> CancelFriendRequestAsync(string currentUserId, string targetUserId);
    Task<List<UserFriendDto>> GetUserFriendsAsync(string userId);
}

