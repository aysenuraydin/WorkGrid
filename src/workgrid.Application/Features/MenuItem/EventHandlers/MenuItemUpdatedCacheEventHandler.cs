using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.MenuItems.EventHandlers;

public class MenuItemUpdatedCacheEventHandler : INotificationHandler<MenuItemUpdatedEvent>
{
    private readonly IAppCache _redisCache;
    public MenuItemUpdatedCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }

    public async Task Handle(MenuItemUpdatedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache(CacheConstants.GetMenuItems);
        await _redisCache.RemoveCache($"{CacheConstants.GetMenuItemById}-{notification.item.Id}");

    }
}