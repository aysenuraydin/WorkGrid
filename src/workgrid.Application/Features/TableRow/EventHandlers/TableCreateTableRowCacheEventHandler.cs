using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.TableRows.EventHandlers;

public class TableCreateTableRowCacheEventHandler : INotificationHandler<TableRowCreatedEvent>
{
    private readonly IAppCache _redisCache;
    public TableCreateTableRowCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }


    public async Task Handle(TableRowCreatedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache($"{CacheConstants.GetTableRowsByTableId}-{notification.row.TableId}");
    }
}