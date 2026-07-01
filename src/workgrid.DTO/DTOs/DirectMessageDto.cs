using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace workgrid.DTO.DTOs;

public record DirectMessageDto(
    Guid Id,
    string SenderId,
    string SenderName,
    string? SenderAvatar,
    string ReceiverId,
    string? MessageText,
    DateTime SentAt,
    bool IsRead,
    string? AttachmentUrl = null,
    string? AttachmentType = null,
    string? AttachmentName = null
);