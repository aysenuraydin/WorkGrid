using workgrid.Domain.Common;
using workgrid.Domain.Events.CommentEvents;

namespace workgrid.Domain.Entities;

public class Comment : BaseAuditableEntity<long>
{
    public string ItemId { get; private set; } = null!;
    public CommentItemTypeEnum ItemType { get; private set; }
    public string UserId { get; private set; } = null!;
    public string Content { get; private set; } = null!;

    public int? Rating { get; private set; }
    public string? Images { get; private set; }
    public long? ParentId { get; private set; }
    public Comment? Parent { get; private set; }
    public ICollection<Comment> Replies { get; private set; } = new List<Comment>();

    public Comment() { }

    public static Comment Create(
        string itemId,
        CommentItemTypeEnum itemType,
        string userId,
        string content,
        int? rating = null,
        long? parentId = null,
        string? images = null)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new DomainException("Yorum içeriği boş olamaz!");

        if (string.IsNullOrWhiteSpace(itemId))
            throw new DomainException("ItemId boş olamaz!");

        var effectiveRating = itemType == CommentItemTypeEnum.Product ? rating : null;

        if (effectiveRating is < 1 or > 5)
            throw new DomainException("Rating 1-5 aralığında olmalı.");

        var comment = new Comment
        {
            ItemId = itemId,
            ItemType = itemType,
            UserId = userId,
            Content = content.Trim(),
            Rating = effectiveRating,
            ParentId = parentId,
            Images = images,
        };

        comment.AddDomainEvent(new CommentCreatedEvent(comment));
        return comment;
    }

    public void UpdateContent(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new DomainException("Yorum içeriği boş olamaz!");

        Content = content.Trim();
        AddDomainEvent(new CommentUpdatedEvent(this));
    }
    public void UpdateImages(string? images)
    {
        Images = images;
        AddDomainEvent(new CommentUpdatedEvent(this));
    }

    public void UpdateRating(int? rating)
    {
        // Rating sadece Product yorumlarında güncellenebilir.
        if (ItemType != CommentItemTypeEnum.Product)
            return;

        if (rating is < 1 or > 5)
            throw new DomainException("Rating 1-5 aralığında olmalı.");

        Rating = rating;
        AddDomainEvent(new CommentUpdatedEvent(this));
    }

    public void Delete()
    {
        AddDomainEvent(new CommentDeletedEvent(this));
    }

    public void HardDelete()
    {
        IsHardDelete = true;
        AddDomainEvent(new CommentDeletedEvent(this));
    }
}