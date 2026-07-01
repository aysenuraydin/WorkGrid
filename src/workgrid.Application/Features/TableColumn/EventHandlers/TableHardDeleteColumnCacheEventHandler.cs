using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.TableColumns.EventHandlers;

public class TableHardDeleteColumnCacheEventHandler : INotificationHandler<TableColumnHardDeletedEvent>
{
    private readonly IAppCache _redisCache;
    public TableHardDeleteColumnCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }


    public async Task Handle(TableColumnHardDeletedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache($"{CacheConstants.GetDeletedTableColumnsByTableId}-{notification.column.TableId}");
    }
}