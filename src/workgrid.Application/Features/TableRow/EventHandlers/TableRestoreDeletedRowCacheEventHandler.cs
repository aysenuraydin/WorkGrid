using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.TableRows.EventHandlers;

public class TableRestoreDeletedRowCacheEventHandler : INotificationHandler<TableRowRestoredDeletedEvent>
{
    private readonly IAppCache _redisCache;
    public TableRestoreDeletedRowCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }


    public async Task Handle(TableRowRestoredDeletedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache($"{CacheConstants.GetDeletedTableRowsByTableId}-{notification.row?.TableId}");

        await _redisCache.RemoveCache($"{CacheConstants.GetTableRowsByTableId}-{notification.row?.TableId}");
    }
}