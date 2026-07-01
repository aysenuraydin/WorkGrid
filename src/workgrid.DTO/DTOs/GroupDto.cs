namespace workgrid.DTO.DTOs;

public record GroupDto(
    Guid Id,
    string Name,
    string CreatedById,
    DateTime CreatedAt,
    List<GroupMemberDto> Members
);