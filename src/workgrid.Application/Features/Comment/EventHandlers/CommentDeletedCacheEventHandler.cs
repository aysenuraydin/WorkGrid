using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events.CommentEvents;

namespace workgrid.Application.Features.Comments.EventHandlers;

public class CommentDeletedCacheEventHandler : INotificationHandler<CommentDeletedEvent>
{
    private readonly IAppCache _redisCache;
    public CommentDeletedCacheEventHandler(IAppCache redisCache) => _redisCache = redisCache;

    public async Task Handle(CommentDeletedEvent notification, CancellationToken cancellationToken)
    {
        var c = notification.Comment;
        await _redisCache.RemoveCache($"{CacheConstants.GetCommentsByItem}-{(int)c.ItemType}-{c.ItemId}");
    }
}