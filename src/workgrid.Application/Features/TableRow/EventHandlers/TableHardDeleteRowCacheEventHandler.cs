using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.TableRows.EventHandlers;

public class TableHardDeleteRowCacheEventHandler : INotificationHandler<TableRowHardDeletedEvent>
{
    private readonly IAppCache _redisCache;
    public TableHardDeleteRowCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }

    public async Task Handle(TableRowHardDeletedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache($"{CacheConstants.GetDeletedTableRowsByTableId}-{notification.row.TableId}");
    }
}