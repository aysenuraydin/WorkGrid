
public class UpdateExperienceProfileDto
{
    public string Id { get; set; } = null!;
    public string? JobTitle { get; set; }
    public string? CompanyName { get; set; }
    public string? ExperienceYears { get; set; }
    public string? JobDescription { get; set; }

}
public class UpdateProfileDto
{
    public string Id { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Skils { get; set; }
    public string? Designation { get; set; }
    public string? Website { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public string? Country { get; set; }
    public string? ZipCode { get; set; }
    public string? Description { get; set; }
}

public class UserDetailResponse
{
    public string Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }

    public List<string> Roles { get; set; } = new();

    public bool IsBlocked { get; set; }
    public DateTimeOffset? LockoutEnd { get; set; }
}

public class UserAllDetailResponse
{
    public string Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }

    public List<string> Roles { get; set; } = new();

    public string? Designation { get; set; }
    public string? Website { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public string? Country { get; set; }
    public string? ZipCode { get; set; }
    public string? Description { get; set; }
    public string? JoiningDate { get; set; }
    public string? Skils { get; set; }
    public string? JobTitle { get; set; }
    public string? CompanyName { get; set; }
    public string? ExperienceYears { get; set; }
    public string? JobDescription { get; set; }
}
public class UpdateProfileRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
}

public class UpdatePasswordRequest
{
    public string Id { get; set; }
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmNewPassword { get; set; } = string.Empty;
}

public class UpdateUserRoleRequest
{
    public string UserId { get; set; }
    public string NewRole { get; set; } = string.Empty;
}

public class UpdateAvatarUrlRequest
{
    public string UserId { get; set; }
    public string ProfilePictureUrl { get; set; } = string.Empty;
}
