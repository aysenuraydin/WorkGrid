using workgrid.Domain.Enums;
namespace workgrid.Domain.Entities;

public class UserPhone : BaseEntity
{
    public int UserId { get; set; }

    public string PhoneNumber { get; set; }

    public PhoneTypeEnum PhoneType { get; set; }

    public User UserFk { get; set; } = null!;
}