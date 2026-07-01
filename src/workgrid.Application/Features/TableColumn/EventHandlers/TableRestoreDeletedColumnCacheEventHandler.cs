using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.TableColumns.EventHandlers;

public class TableRestoreDeletedColumnCacheEventHandler : INotificationHandler<TableColumnRestoredDeletedEvent>
{
    private readonly IAppCache _redisCache;
    public TableRestoreDeletedColumnCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }

    public async Task Handle(TableColumnRestoredDeletedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache(CacheConstants.GetAllTableColumns);
        await _redisCache.RemoveCache($"{CacheConstants.GetTableColumnsByTableId}-{notification.column.TableId}");
        await _redisCache.RemoveCache($"{CacheConstants.GetDeletedTableColumnsByTableId}-{notification.column.TableId}");
    }
}