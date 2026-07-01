namespace workgrid.DTO.DTOs;

public record GroupMemberDto(
    string UserId,
    string Name,
    string? Avatar,
    bool IsAdmin
);