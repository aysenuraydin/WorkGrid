using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events.CommentEvents;

namespace workgrid.Application.Features.Comments.EventHandlers;

// Yorum oluşturulunca o item'ın yorum cache'ini temizle
public class CommentCreatedCacheEventHandler : INotificationHandler<CommentCreatedEvent>
{
    private readonly IAppCache _redisCache;
    public CommentCreatedCacheEventHandler(IAppCache redisCache) => _redisCache = redisCache;

    public async Task Handle(CommentCreatedEvent notification, CancellationToken cancellationToken)
    {
        var c = notification.Comment;
        await _redisCache.RemoveCache($"{CacheConstants.GetCommentsByItem}-{(int)c.ItemType}-{c.ItemId}");
    }
}
