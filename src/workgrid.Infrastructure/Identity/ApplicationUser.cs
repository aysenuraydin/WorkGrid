using Microsoft.AspNetCore.Identity;

namespace workgrid.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ActivationCode { get; set; }
    public string? RefreshToken { get; set; }

    public string? ProfilePictureUrl { get; set; }

    public string? Designation { get; set; }
    public string? Website { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Address { get; set; }
    public string? ZipCode { get; set; }
    public string? Description { get; set; }
    public string? JoiningDate { get; set; }
    public string? Skils { get; set; }
    public string? JobTitle { get; set; }
    public string? CompanyName { get; set; }
    public string? ExperienceYears { get; set; }
    public string? JobDescription { get; set; }

    public virtual ICollection<UserFriend> SentFriendRequests { get; set; } = new List<UserFriend>();
    public virtual ICollection<UserFriend> ReceivedFriendRequests { get; set; } = new List<UserFriend>();
}