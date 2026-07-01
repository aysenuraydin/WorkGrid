namespace workgrid.DTO.DTOs;

public record CreateGroupRequest(
    string Name,
    List<string> MemberIds
);