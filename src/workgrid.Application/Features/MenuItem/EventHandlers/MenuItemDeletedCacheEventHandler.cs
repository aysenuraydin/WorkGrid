using MediatR;
using Microsoft.Extensions.Logging;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.MenuItems.EventHandlers;

public class MenuItemDeletedCacheEventHandler : INotificationHandler<MenuItemDeletedEvent>
{
    private readonly IAppCache _redisCache;
    public MenuItemDeletedCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }

    public async Task Handle(MenuItemDeletedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache(CacheConstants.GetMenuItems);
        await _redisCache.RemoveCache(CacheConstants.GetDeletedMenuItems);
        await _redisCache.RemoveCache($"{CacheConstants.GetMenuItemById}-{notification.item.Id}");
    }
}