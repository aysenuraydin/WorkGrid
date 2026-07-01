using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace workgrid.DTO.DTOs;

public record ChannelMessageDto(
    Guid Id,
    Guid ChannelId,
    string SenderId,
    string SenderName,
    string? SenderAvatar,
    string? MessageText,
    DateTime SentAt,
    string? AttachmentUrl = null,
    string? AttachmentType = null,
    string? AttachmentName = null
);