using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.TableColumns.EventHandlers;

public class TableCreateTableColumnCacheEventHandler : INotificationHandler<TableColumnCreatedEvent>
{
    private readonly IAppCache _redisCache;
    public TableCreateTableColumnCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }


    public async Task Handle(TableColumnCreatedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache(CacheConstants.GetAllTableColumns);
        await _redisCache.RemoveCache($"{CacheConstants.GetTableColumnsByTableId}-{notification.column.TableId}");
    }
}