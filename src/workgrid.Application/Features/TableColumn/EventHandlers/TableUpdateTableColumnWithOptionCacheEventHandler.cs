using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.TableColumns.EventHandlers;

public class TableUpdateTableColumnWithOptionCacheEventHandler : INotificationHandler<TableColumnWithOptionUpdatedEvent>
{
    private readonly IAppCache _redisCache;
    public TableUpdateTableColumnWithOptionCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }
    public async Task Handle(TableColumnWithOptionUpdatedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache($"{CacheConstants.GetTableColumnsByTableId}-{notification.column.TableId}");
    }
}