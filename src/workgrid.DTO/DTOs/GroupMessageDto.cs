namespace workgrid.DTO.DTOs;

public record GroupMessageDto(
    Guid Id,
    Guid GroupId,
    string SenderId,
    string SenderName,
    string? SenderAvatar,
    string? MessageText,
    DateTime SentAt,
    string? AttachmentUrl = null,
    string? AttachmentType = null,
    string? AttachmentName = null
);