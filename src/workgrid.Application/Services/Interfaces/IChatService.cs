
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface IChatService
{
    Task<List<DirectMessageDto>> GetConversationAsync(string currentUserId, string otherUserId);
    Task<DirectMessageDto> SendDirectMessageAsync(string senderId, SendDirectMessageRequest request);
    Task<List<object>> GetRecentContactsAsync(string currentUserId);

    Task<List<ChannelDto>> GetChannelsAsync();
    Task<ChannelDto> CreateChannelAsync(string createdById, CreateChannelRequest request);
    Task DeleteChannelAsync(Guid channelId, string requestingUserId);
    Task<List<ChannelMessageDto>> GetChannelMessagesAsync(Guid channelId);
    Task<List<Guid>> MarkMessagesAsReadAsync(string currentUserId, string otherUserId);
    Task<ChannelMessageDto> SendChannelMessageAsync(Guid channelId, string senderId, SendChannelMessageRequest request);
    Task<List<GroupDto>> GetMyGroupsAsync(string userId);
    Task<GroupDto> CreateGroupAsync(string creatorId, CreateGroupRequest request);
    Task DeleteGroupAsync(Guid groupId, string requestingUserId);
    Task UpdateGroupNameAsync(Guid groupId, string requestingUserId, UpdateGroupNameRequest request);
    Task AddGroupMemberAsync(Guid groupId, string requestingUserId, AddGroupMemberRequest request);
    Task RemoveGroupMemberAsync(Guid groupId, string requestingUserId, string targetUserId);
    Task<List<GroupMessageDto>> GetGroupMessagesAsync(Guid groupId, string requestingUserId);
    Task<GroupMessageDto> SendGroupMessageAsync(Guid groupId, string senderId, SendGroupMessageRequest request);
}