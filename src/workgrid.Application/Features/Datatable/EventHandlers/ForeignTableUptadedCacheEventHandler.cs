using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events.DatatableEvents;

namespace workgrid.Application.Features.Datatables.EventHandlers;

public class ForeignTableUpdatedCacheEventHandler : INotificationHandler<ForeignTableUpdatedEvent>
{
    private readonly IAppCache _redisCache;
    public ForeignTableUpdatedCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }

    public async Task Handle(ForeignTableUpdatedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache(CacheConstants.GetDatatables);
        await _redisCache.RemoveCache(CacheConstants.GetDatatablesWithRelationships);
        await _redisCache.RemoveCache(CacheConstants.GetAllTableColumns);
        await _redisCache.RemoveCache($"{CacheConstants.GetTableColumnsByTableId}-{notification.table.Id}");
        await _redisCache.RemoveCache($"{CacheConstants.GetTableRowsByTableId}-{notification.table.Id}");
        await _redisCache.RemoveCache($"{CacheConstants.GetDatatableById}-{notification.table.Id}");

    }
}