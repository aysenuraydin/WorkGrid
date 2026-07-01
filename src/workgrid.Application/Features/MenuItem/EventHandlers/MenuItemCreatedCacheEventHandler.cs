using MediatR;
using Microsoft.Extensions.Logging;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.MenuItems.EventHandlers;

public class MenuItemCreatedCacheEventHandler : INotificationHandler<MenuItemCreatedEvent>
{
    private readonly IAppCache _redisCache;
    public MenuItemCreatedCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }

    public async Task Handle(MenuItemCreatedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache(CacheConstants.GetMenuItems);
    }
}