using MediatR;
using Microsoft.Extensions.Logging;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.TableRows.EventHandlers;

public class TableDeleteRowCacheEventHandler : INotificationHandler<TableRowDeletedEvent>
{
    private readonly IAppCache _redisCache;
    public TableDeleteRowCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }


    public async Task Handle(TableRowDeletedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache($"{CacheConstants.GetDeletedTableRowsByTableId}-{notification.row?.TableId}");

        await _redisCache.RemoveCache($"{CacheConstants.GetTableRowsByTableId}-{notification.row?.TableId}");

    }
}