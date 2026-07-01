using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.TableCells.EventHandlers;

public class UpdateTableCellCacheEventHandler : INotificationHandler<TableCellUpdatedEvent>
{
    private readonly IAppCache _redisCache;
    public UpdateTableCellCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }


    public async Task Handle(TableCellUpdatedEvent notification, CancellationToken cancellationToken)
    {
        // Cache temizleme mantığı burada
        await _redisCache.RemoveCache($"{CacheConstants.GetTableRowsByTableId}-{notification.cell?.RowFk?.TableId}");
        await _redisCache.RemoveCache($"{CacheConstants.GetTableRowById}-{notification.cell?.RowId}");
    }
}