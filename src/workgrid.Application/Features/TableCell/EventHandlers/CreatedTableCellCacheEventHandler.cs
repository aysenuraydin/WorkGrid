using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.TableCells.EventHandlers;

public class CreatedTableCellCacheEventHandler : INotificationHandler<TableCellCreatedEvent>
{
    private readonly IAppCache _redisCache;
    public CreatedTableCellCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }


    public async Task Handle(TableCellCreatedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache($"{CacheConstants.GetTableRowsByTableId}-{notification.cell?.RowFk?.TableId}");
        await _redisCache.RemoveCache($"{CacheConstants.GetCellsByColumnId}-{notification.cell?.ColumnId}");
    }
}