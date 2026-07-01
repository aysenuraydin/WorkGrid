namespace workgrid.DTO.DTOs;

public class UserFriendDto
{
    public string Id { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? JobTitle { get; set; }
    public string? CompanyName { get; set; }
}