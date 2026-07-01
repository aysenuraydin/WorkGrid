using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;
using workgrid.Infrastructure.Hubs;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly IHubContext<ChatHub> _hubContext;

    public ChatController(IChatService chatService, IHubContext<ChatHub> hubContext)
    {
        _chatService = chatService;
        _hubContext = hubContext;
    }

    private string CurrentUserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

    [HttpGet("presence")]
    public async Task<IActionResult> GetOnlineUsers(
    [FromServices] IPresenceService presence)
    {
        var onlineIds = await presence.GetOnlineUserIdsAsync();
        return Ok(onlineIds);
    }


    [HttpGet("messages/{otherUserId}")]
    public async Task<IActionResult> GetConversation(string otherUserId)
    {
        var messages = await _chatService.GetConversationAsync(CurrentUserId, otherUserId);
        return Ok(messages);
    }

    [HttpPost("messages")]
    public async Task<IActionResult> SendDirectMessage([FromBody] SendDirectMessageRequest request)
    {
        var message = await _chatService.SendDirectMessageAsync(CurrentUserId, request);

        await _hubContext.Clients
            .Group($"user_{request.ReceiverId}")
            .SendAsync("ReceiveDirectMessage", message);

        await _hubContext.Clients
            .Group($"user_{CurrentUserId}")
            .SendAsync("ReceiveDirectMessage", message);

        return Ok(message);
    }
    [HttpPost("messages/{otherUserId}/read")]
    public async Task<IActionResult> MarkAsRead(string otherUserId)
    {
        var readIds = await _chatService.MarkMessagesAsReadAsync(CurrentUserId, otherUserId);

        await _hubContext.Clients
            .Group($"user_{otherUserId}")
            .SendAsync("MessagesRead", new { ReadBy = CurrentUserId, MessageIds = readIds });

        return Ok();
    }

    [HttpGet("contacts")]
    public async Task<IActionResult> GetRecentContacts()
    {
        var contacts = await _chatService.GetRecentContactsAsync(CurrentUserId);
        return Ok(contacts);
    }


    [HttpGet("channels")]
    public async Task<IActionResult> GetChannels()
    {
        var channels = await _chatService.GetChannelsAsync();
        return Ok(channels);
    }

    [HttpPost("channels")]
    [Authorize(Roles = "Admin,WG")]
    public async Task<IActionResult> CreateChannel([FromBody] CreateChannelRequest request)
    {
        var channel = await _chatService.CreateChannelAsync(CurrentUserId, request);
        return Ok(channel);
    }

    [HttpDelete("channels/{channelId:guid}")]
    [Authorize(Roles = "Admin,WG")]
    public async Task<IActionResult> DeleteChannel(Guid channelId)
    {
        await _chatService.DeleteChannelAsync(channelId, CurrentUserId);
        return NoContent();
    }

    [HttpGet("channels/{channelId:guid}/messages")]
    public async Task<IActionResult> GetChannelMessages(Guid channelId)
    {
        var messages = await _chatService.GetChannelMessagesAsync(channelId);
        return Ok(messages);
    }

    [HttpPost("channels/{channelId:guid}/messages")]
    public async Task<IActionResult> SendChannelMessage(
        Guid channelId,
        [FromBody] SendChannelMessageRequest request)
    {
        var message = await _chatService.SendChannelMessageAsync(channelId, CurrentUserId, request);

        await _hubContext.Clients
            .Group($"channel_{channelId}")
            .SendAsync("ReceiveChannelMessage", message);

        return Ok(message);
    }

    [HttpGet("groups")]
    public async Task<IActionResult> GetMyGroups()
    {
        var groups = await _chatService.GetMyGroupsAsync(CurrentUserId);
        return Ok(groups);
    }

    [HttpPost("groups")]
    public async Task<IActionResult> CreateGroup([FromBody] CreateGroupRequest request)
    {
        var group = await _chatService.CreateGroupAsync(CurrentUserId, request);

        foreach (var member in group.Members)
        {
            await _hubContext.Clients
                .Group($"user_{member.UserId}")
                .SendAsync("AddedToGroup", group);
        }

        return Ok(group);
    }

    [HttpDelete("groups/{groupId:guid}")]
    public async Task<IActionResult> DeleteGroup(Guid groupId)
    {
        await _chatService.DeleteGroupAsync(groupId, CurrentUserId);
        await _hubContext.Clients
            .Group($"group_{groupId}")
            .SendAsync("GroupDeleted", groupId);
        return NoContent();
    }

    [HttpPut("groups/{groupId:guid}/name")]
    public async Task<IActionResult> UpdateGroupName(Guid groupId, [FromBody] UpdateGroupNameRequest request)
    {
        await _chatService.UpdateGroupNameAsync(groupId, CurrentUserId, request);
        await _hubContext.Clients
            .Group($"group_{groupId}")
            .SendAsync("GroupRenamed", new { GroupId = groupId, request.Name });
        return Ok();
    }

    [HttpPost("groups/{groupId:guid}/members")]
    public async Task<IActionResult> AddMember(Guid groupId, [FromBody] AddGroupMemberRequest request)
    {
        await _chatService.AddGroupMemberAsync(groupId, CurrentUserId, request);
        await _hubContext.Clients
            .Group($"user_{request.UserId}")
            .SendAsync("AddedToGroup", new { GroupId = groupId });
        return Ok();
    }

    [HttpDelete("groups/{groupId:guid}/members/{userId}")]
    public async Task<IActionResult> RemoveMember(Guid groupId, string userId)
    {
        await _chatService.RemoveGroupMemberAsync(groupId, CurrentUserId, userId);
        await _hubContext.Clients
            .Group($"user_{userId}")
            .SendAsync("RemovedFromGroup", new { GroupId = groupId });
        return Ok();
    }

    [HttpGet("groups/{groupId:guid}/messages")]
    public async Task<IActionResult> GetGroupMessages(Guid groupId)
    {
        var messages = await _chatService.GetGroupMessagesAsync(groupId, CurrentUserId);
        return Ok(messages);
    }

    [HttpPost("groups/{groupId:guid}/messages")]
    public async Task<IActionResult> SendGroupMessage(Guid groupId, [FromBody] SendGroupMessageRequest request)
    {
        var message = await _chatService.SendGroupMessageAsync(groupId, CurrentUserId, request);
        await _hubContext.Clients
            .Group($"group_{groupId}")
            .SendAsync("ReceiveGroupMessage", message);
        return Ok(message);
    }
}