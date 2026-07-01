using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events.CommentEvents;

namespace workgrid.Application.Features.Comments.EventHandlers;

public class CommentUpdatedCacheEventHandler : INotificationHandler<CommentUpdatedEvent>
{
    private readonly IAppCache _redisCache;
    public CommentUpdatedCacheEventHandler(IAppCache redisCache) => _redisCache = redisCache;

    public async Task Handle(CommentUpdatedEvent notification, CancellationToken cancellationToken)
    {
        var c = notification.Comment;
        await _redisCache.RemoveCache($"{CacheConstants.GetCommentsByItem}-{(int)c.ItemType}-{c.ItemId}");
    }
}
