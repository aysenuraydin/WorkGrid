using workgrid.Domain.Enums;
namespace workgrid.Domain.Entities;

public class UserEmail : BaseEntity
{
    public int? UserId { get; set; }
    public string? EmailAddress { get; set; }
    public EmailTypeEnum EmailType { get; set; }

    public User? UserFk { get; set; }
}