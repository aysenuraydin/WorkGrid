using workgrid.Domain.Common;
using workgrid.Domain.Events;
namespace workgrid.Domain.Entities;

public class MenuItem : BaseAuditableEntity<long>
{
    public string Label { get; private set; } = null!;
    public string? Link { get; private set; }
    public string? Icon { get; private set; }
    public bool Visible { get; private set; }
    public bool IsHeader { get; private set; }
    public int Order { get; private set; }
    public long? ParentId { get; private set; }
    public bool Locked { get; private set; }
    public bool? IsAdmin { get; private set; }
    public Badge? BadgeFk { get; private set; }

    public MenuItem() { }

    public static MenuItem Create(
        string label,
        int order,
        string? link = null,
        string? icon = null,
        bool visible = true,
        bool isHeader = false,
        long? parentId = null,
        bool locked = false,
        bool? isAdmin = false,
        string? badgeName = null,
        string? badgeColor = null
    )
    {
        if (string.IsNullOrWhiteSpace(label)) throw new DomainException("Label boş olamaz!");

        Badge? badge = null;

        if (!string.IsNullOrWhiteSpace(badgeName)
        || !string.IsNullOrWhiteSpace(badgeColor))
        {
            badge = new Badge
            {
                Name = badgeName,
                Color = badgeColor
            };
        }

        var item = new MenuItem
        {
            Label = label,
            Link = link,
            Icon = icon,
            Visible = visible,
            IsHeader = isHeader,
            Order = order,
            ParentId = parentId,
            Locked = locked,
            IsAdmin = isAdmin,
            BadgeFk = badge
        };

        item.AddDomainEvent(new MenuItemCreatedEvent(item));
        return item;
    }

    public void Update(string label, string? link, string? icon, bool visible, bool isHeader, int order, long? parentId, bool locked, bool? isAdmin, string? badgeName,
    string? badgeColor)
    {
        Label = label;
        Link = link;
        Icon = icon;
        Visible = visible;
        IsHeader = isHeader;
        Order = order;
        ParentId = parentId;
        Locked = locked;
        IsAdmin = isAdmin;

        if (!string.IsNullOrWhiteSpace(badgeName) || !string.IsNullOrWhiteSpace(badgeColor))
        {
            if (BadgeFk == null) BadgeFk = new Badge();
            BadgeFk.Name = badgeName ?? "";
            BadgeFk.Color = badgeColor ?? "";
        }
        else
        {
            BadgeFk = null;
        }

        AddDomainEvent(new MenuItemUpdatedEvent(this));
    }

    public void UpdateOrder(int newOrder)
    {
        Order = newOrder;
        AddDomainEvent(new MenuItemUpdatedEvent(this));
    }

    public void ShowOrHide(bool visible)
    {
        if (Visible == visible) return;

        Visible = visible;
        AddDomainEvent(new MenuItemUpdatedEvent(this));
    }
    public void ChangePrivacy(bool isAdmin)
    {
        if (IsAdmin == isAdmin) return;

        IsAdmin = isAdmin;
        AddDomainEvent(new MenuItemUpdatedEvent(this));
    }

    public void Delete()
    {
        AddDomainEvent(new MenuItemDeletedEvent(this));
    }
    public void HardDelete()
    {
        IsHardDelete = true;
        AddDomainEvent(new MenuItemDeletedEvent(this));
    }
    public void Restore()
    {
        DeletedAt = null;
        DeletedBy = null;

        AddDomainEvent(new MenuItemRestoredDeletedEvent(this));
    }
}

[Serializable]
internal class DomainException : Exception
{
    public DomainException()
    {
    }

    public DomainException(string? message) : base(message)
    {
    }

    public DomainException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
