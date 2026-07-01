using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Infrastructure.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IPresenceService _presence;

    public ChatHub(IPresenceService presence)
    {
        _presence = presence;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            await _presence.SetOnlineAsync(userId);

            // Herkese bu kullanıcının online olduğunu bildir
            await Clients.Others.SendAsync("UserOnline", userId);
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
        {
            await _presence.SetOfflineAsync(userId);
            await Clients.Others.SendAsync("UserOffline", userId);
        }
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinChannel(string channelId) =>
        await Groups.AddToGroupAsync(Context.ConnectionId, $"channel_{channelId}");

    public async Task LeaveChannel(string channelId) =>
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"channel_{channelId}");

    public async Task JoinGroup(string groupId) =>
        await Groups.AddToGroupAsync(Context.ConnectionId, $"group_{groupId}");

    public async Task LeaveGroup(string groupId) =>
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"group_{groupId}");

    // Mesaj okundu bildirimi
    public async Task MarkDirectMessageRead(string senderId, string messageId)
    {
        var receiverId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        await Clients.Group($"user_{senderId}").SendAsync("MessageRead", new
        {
            MessageId = messageId,
            ReadBy = receiverId
        });
    }



    public async Task SendDirectMessage(string receiverId, string messageText)
    {
        var senderId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        await Clients.Group($"user_{receiverId}").SendAsync("ReceiveDirectMessage", new
        {
            SenderId = senderId,
            ReceiverId = receiverId,
            MessageText = messageText,
            SentAt = DateTime.UtcNow
        });
        await Clients.Group($"user_{senderId}").SendAsync("ReceiveDirectMessage", new
        {
            SenderId = senderId,
            ReceiverId = receiverId,
            MessageText = messageText,
            SentAt = DateTime.UtcNow
        });
    }

    // Kanala mesaj gönder
    public async Task SendChannelMessage(string channelId, string messageText)
    {
        var senderId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        await Clients.Group($"channel_{channelId}").SendAsync("ReceiveChannelMessage", new
        {
            ChannelId = channelId,
            SenderId = senderId,
            MessageText = messageText,
            SentAt = DateTime.UtcNow
        });
    }

    public async Task SendGroupMessage(string groupId, string messageText)
    {
        var senderId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        await Clients.Group($"group_{groupId}").SendAsync("ReceiveGroupMessage", new
        {
            GroupId = groupId,
            SenderId = senderId,
            MessageText = messageText,
            SentAt = DateTime.UtcNow
        });
    }



}