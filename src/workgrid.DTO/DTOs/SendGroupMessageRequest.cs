namespace workgrid.DTO.DTOs;

public record SendGroupMessageRequest(
    string? MessageText = null,
    string? AttachmentUrl = null,
    string? AttachmentType = null,
    string? AttachmentName = null
);