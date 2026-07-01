namespace workgrid.Infrastructure.Identity;

public class UserFriend
{
    public string UserId { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;

    public string FriendId { get; set; } = null!;
    public ApplicationUser Friend { get; set; } = null!;

    public DateTime ActionDate { get; set; } = DateTime.UtcNow;
    public bool IsAccepted { get; set; } = false;
}