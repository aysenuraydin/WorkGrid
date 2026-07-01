using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.DTO.DTOs;
using workgrid.Infrastructure.Identity;
using workgrid.Infrastructure.Persistence;

namespace workgrid.Infrastructure.Services;

public class ChatService : IChatService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly WorkGridDbContext _db;
    public ChatService(UserManager<ApplicationUser> userManager, WorkGridDbContext db)
    {
        _userManager = userManager;
        _db = db;
    }

    // ── DIRECT: GetConversation (DTO'ya attachment ekle) ──
    public async Task<List<DirectMessageDto>> GetConversationAsync(string currentUserId, string otherUserId)
    {
        var messages = await _db.DirectMessages
            .Where(m =>
                (m.SenderId == currentUserId && m.ReceiverId == otherUserId) ||
                (m.SenderId == otherUserId && m.ReceiverId == currentUserId))
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        var senderIds = messages.Select(m => m.SenderId).Distinct().ToList();
        var users = await _userManager.Users
            .Where(u => senderIds.Contains(u.Id))
            .ToListAsync();

        return messages.Select(m =>
        {
            var sender = users.First(u => u.Id == m.SenderId);
            return new DirectMessageDto(
                m.Id, m.SenderId,
                $"{sender.FirstName} {sender.LastName}".Trim(),
                sender.ProfilePictureUrl,
                m.ReceiverId, m.MessageText, m.SentAt, m.IsRead,
                m.AttachmentUrl, m.AttachmentType, m.AttachmentName   // ← YENİ
            );
        }).ToList();
    }

    // ── DIRECT: Send (attachment kaydet + DTO'ya koy) ──
    public async Task<DirectMessageDto> SendDirectMessageAsync(string senderId, SendDirectMessageRequest request)
    {
        var message = new DirectMessage
        {
            Id = Guid.NewGuid(),
            SenderId = senderId,
            ReceiverId = request.ReceiverId,
            MessageText = request.MessageText,
            SentAt = DateTime.UtcNow,
            AttachmentUrl = request.AttachmentUrl,
            AttachmentType = request.AttachmentType,
            AttachmentName = request.AttachmentName,
        };

        _db.DirectMessages.Add(message);
        await _db.SaveChangesAsync();

        var sender = await _userManager.FindByIdAsync(senderId);
        return new DirectMessageDto(
            message.Id, message.SenderId,
            $"{sender!.FirstName} {sender.LastName}".Trim(),
            sender.ProfilePictureUrl,
            message.ReceiverId, message.MessageText, message.SentAt, message.IsRead,
            message.AttachmentUrl, message.AttachmentType, message.AttachmentName   // ← YENİ
        );
    }

    // ── CHANNEL: GetMessages ──
    public async Task<List<ChannelMessageDto>> GetChannelMessagesAsync(Guid channelId)
    {
        var messages = await _db.ChannelMessages
            .Where(m => m.ChannelId == channelId)
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        var senderIds = messages.Select(m => m.SenderId).Distinct().ToList();
        var users = await _userManager.Users
            .Where(u => senderIds.Contains(u.Id))
            .ToListAsync();

        return messages.Select(m =>
        {
            var sender = users.First(u => u.Id == m.SenderId);
            return new ChannelMessageDto(
                m.Id, m.ChannelId, m.SenderId,
                $"{sender.FirstName} {sender.LastName}".Trim(),
                sender.ProfilePictureUrl,
                m.MessageText, m.SentAt,
                m.AttachmentUrl, m.AttachmentType, m.AttachmentName   // ← YENİ
            );
        }).ToList();
    }

    // ── CHANNEL: Send ──
    public async Task<ChannelMessageDto> SendChannelMessageAsync(Guid channelId, string senderId, SendChannelMessageRequest request)
    {
        var message = new ChannelMessage
        {
            Id = Guid.NewGuid(),
            ChannelId = channelId,
            SenderId = senderId,
            MessageText = request.MessageText,
            SentAt = DateTime.UtcNow,
            AttachmentUrl = request.AttachmentUrl,     // ← YENİ
            AttachmentType = request.AttachmentType,   // ← YENİ
            AttachmentName = request.AttachmentName,   // ← YENİ
        };

        _db.ChannelMessages.Add(message);
        await _db.SaveChangesAsync();

        var sender = await _userManager.FindByIdAsync(senderId);
        return new ChannelMessageDto(
            message.Id, message.ChannelId, message.SenderId,
            $"{sender!.FirstName} {sender.LastName}".Trim(),
            sender.ProfilePictureUrl,
            message.MessageText, message.SentAt,
            message.AttachmentUrl, message.AttachmentType, message.AttachmentName   // ← YENİ
        );
    }

    // ── GROUP: GetMessages ──
    public async Task<List<GroupMessageDto>> GetGroupMessagesAsync(Guid groupId, string requestingUserId)
    {
        var isMember = await _db.GroupMembers
            .AnyAsync(m => m.GroupId == groupId && m.UserId == requestingUserId);
        if (!isMember) throw new UnauthorizedAccessException("You are not a member of this group.");

        var messages = await _db.GroupMessages
            .Where(m => m.GroupId == groupId)
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        var senderIds = messages.Select(m => m.SenderId).Distinct().ToList();
        var users = await _userManager.Users
            .Where(u => senderIds.Contains(u.Id))
            .ToListAsync();

        return messages.Select(m =>
        {
            var sender = users.First(u => u.Id == m.SenderId);
            return new GroupMessageDto(
                m.Id, m.GroupId, m.SenderId,
                $"{sender.FirstName} {sender.LastName}".Trim(),
                sender.ProfilePictureUrl,
                m.MessageText, m.SentAt,
                m.AttachmentUrl, m.AttachmentType, m.AttachmentName   // ← YENİ
            );
        }).ToList();
    }

    // ── GROUP: Send ──
    public async Task<GroupMessageDto> SendGroupMessageAsync(Guid groupId, string senderId, SendGroupMessageRequest request)
    {
        var isMember = await _db.GroupMembers
            .AnyAsync(m => m.GroupId == groupId && m.UserId == senderId);
        if (!isMember) throw new UnauthorizedAccessException("You are not a member of this group.");

        var message = new GroupMessage
        {
            Id = Guid.NewGuid(),
            GroupId = groupId,
            SenderId = senderId,
            MessageText = request.MessageText,
            SentAt = DateTime.UtcNow,
            AttachmentUrl = request.AttachmentUrl,     // ← YENİ
            AttachmentType = request.AttachmentType,   // ← YENİ
            AttachmentName = request.AttachmentName,   // ← YENİ
        };

        _db.GroupMessages.Add(message);
        await _db.SaveChangesAsync();

        var sender = await _userManager.FindByIdAsync(senderId);
        return new GroupMessageDto(
            message.Id, message.GroupId, message.SenderId,
            $"{sender!.FirstName} {sender.LastName}".Trim(),
            sender.ProfilePictureUrl,
            message.MessageText, message.SentAt,
            message.AttachmentUrl, message.AttachmentType, message.AttachmentName   // ← YENİ
        );
    }
    public async Task<List<object>> GetRecentContactsAsync(string currentUserId)
    {
        // En son mesajlaşılan kişileri döndür
        var contactIds = await _db.DirectMessages
            .Where(m => m.SenderId == currentUserId || m.ReceiverId == currentUserId)
            .Select(m => m.SenderId == currentUserId ? m.ReceiverId : m.SenderId)
            .Distinct()
            .ToListAsync();

        var contacts = await _userManager.Users
            .Where(u => contactIds.Contains(u.Id))
            .ToListAsync();

        return contacts.Select(u => (object)new
        {
            u.Id,
            Name = $"{u.FirstName} {u.LastName}".Trim(),
            u.ProfilePictureUrl,
            u.UserName
        }).ToList();
    }

    public async Task<List<ChannelDto>> GetChannelsAsync()
    {
        return await _db.Channels
            .OrderBy(c => c.CreatedAt)
            .Select(c => new ChannelDto(c.Id, c.Name, c.CreatedById, c.CreatedAt))
            .ToListAsync();
    }

    public async Task<ChannelDto> CreateChannelAsync(string createdById, CreateChannelRequest request)
    {
        var channel = new Channel
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            CreatedById = createdById,
            CreatedAt = DateTime.UtcNow
        };

        _db.Channels.Add(channel);
        await _db.SaveChangesAsync();

        return new ChannelDto(channel.Id, channel.Name, channel.CreatedById, channel.CreatedAt);
    }

    public async Task DeleteChannelAsync(Guid channelId, string requestingUserId)
    {
        var channel = await _db.Channels.FindAsync(channelId)
            ?? throw new KeyNotFoundException("Channel not found.");

        _db.Channels.Remove(channel);
        await _db.SaveChangesAsync();
    }

    public async Task<List<GroupDto>> GetMyGroupsAsync(string userId)
    {
        var groups = await _db.Groups
            .Include(g => g.Members)
            .Where(g => g.Members.Any(m => m.UserId == userId))
            .OrderBy(g => g.Name)
            .ToListAsync();

        return await MapGroupsAsync(groups);
    }

    public async Task<GroupDto> CreateGroupAsync(string creatorId, CreateGroupRequest request)
    {
        var group = new Group
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            CreatedById = creatorId,
            CreatedAt = DateTime.UtcNow
        };

        group.Members.Add(new GroupMember
        {
            Id = Guid.NewGuid(),
            GroupId = group.Id,
            UserId = creatorId,
            IsAdmin = true,
            JoinedAt = DateTime.UtcNow
        });

        foreach (var memberId in request.MemberIds.Where(id => id != creatorId))
        {
            group.Members.Add(new GroupMember
            {
                Id = Guid.NewGuid(),
                GroupId = group.Id,
                UserId = memberId,
                IsAdmin = false,
                JoinedAt = DateTime.UtcNow
            });
        }

        _db.Groups.Add(group);
        await _db.SaveChangesAsync();

        return (await MapGroupsAsync(new List<Group> { group })).First();
    }

    public async Task DeleteGroupAsync(Guid groupId, string requestingUserId)
    {
        var group = await _db.Groups
            .Include(g => g.Members)
            .FirstOrDefaultAsync(g => g.Id == groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        var isAdmin = group.Members.Any(m => m.UserId == requestingUserId && m.IsAdmin);
        if (!isAdmin) throw new UnauthorizedAccessException("Only group admin can delete the group.");

        _db.Groups.Remove(group);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateGroupNameAsync(Guid groupId, string requestingUserId, UpdateGroupNameRequest request)
    {
        var group = await _db.Groups
            .Include(g => g.Members)
            .FirstOrDefaultAsync(g => g.Id == groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        var isAdmin = group.Members.Any(m => m.UserId == requestingUserId && m.IsAdmin);
        if (!isAdmin) throw new UnauthorizedAccessException("Only group admin can rename the group.");

        group.Name = request.Name;
        await _db.SaveChangesAsync();
    }

    public async Task AddGroupMemberAsync(Guid groupId, string requestingUserId, AddGroupMemberRequest request)
    {
        var group = await _db.Groups
            .Include(g => g.Members)
            .FirstOrDefaultAsync(g => g.Id == groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        var isAdmin = group.Members.Any(m => m.UserId == requestingUserId && m.IsAdmin);
        if (!isAdmin) throw new UnauthorizedAccessException("Only group admin can add members.");

        if (group.Members.Any(m => m.UserId == request.UserId))
            throw new InvalidOperationException("User is already a member.");

        group.Members.Add(new GroupMember
        {
            Id = Guid.NewGuid(),
            GroupId = groupId,
            UserId = request.UserId,
            IsAdmin = false,
            JoinedAt = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();
    }

    public async Task RemoveGroupMemberAsync(Guid groupId, string requestingUserId, string targetUserId)
    {
        var group = await _db.Groups
            .Include(g => g.Members)
            .FirstOrDefaultAsync(g => g.Id == groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        var isAdmin = group.Members.Any(m => m.UserId == requestingUserId && m.IsAdmin);
        if (!isAdmin) throw new UnauthorizedAccessException("Only group admin can remove members.");

        if (targetUserId == requestingUserId)
            throw new InvalidOperationException("Admin cannot remove themselves.");

        var member = group.Members.FirstOrDefault(m => m.UserId == targetUserId)
            ?? throw new KeyNotFoundException("Member not found.");

        group.Members.Remove(member);
        await _db.SaveChangesAsync();
    }
    private async Task<List<GroupDto>> MapGroupsAsync(List<Group> groups)
    {
        var userIds = groups.SelectMany(g => g.Members.Select(m => m.UserId)).Distinct().ToList();
        var users = await _userManager.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();

        return groups.Select(g => new GroupDto(
            g.Id, g.Name, g.CreatedById, g.CreatedAt,
            g.Members.Select(m =>
            {
                var u = users.FirstOrDefault(u => u.Id == m.UserId);
                return new GroupMemberDto(
                    m.UserId,
                    u != null ? $"{u.FirstName} {u.LastName}".Trim() : "Unknown",
                    u?.ProfilePictureUrl,
                    m.IsAdmin
                );
            }).ToList()
        )).ToList();
    }
    public async Task<List<Guid>> MarkMessagesAsReadAsync(string currentUserId, string otherUserId)
    {
        var unread = await _db.DirectMessages
            .Where(m => m.SenderId == otherUserId &&
                        m.ReceiverId == currentUserId &&
                        !m.IsRead)
            .ToListAsync();

        foreach (var msg in unread)
        {
            msg.IsRead = true;
            msg.ReadAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        return unread.Select(m => m.Id).ToList();
    }

}