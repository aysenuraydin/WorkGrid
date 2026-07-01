using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events.DatatableEvents;

namespace workgrid.Application.Features.Datatables.EventHandlers;

public class DatatableUpdatedCacheEventHandler : INotificationHandler<DatatableUpdatedEvent>
{
    private readonly IAppCache _redisCache;
    public DatatableUpdatedCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }

    public async Task Handle(DatatableUpdatedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache(CacheConstants.GetDatatables);
        await _redisCache.RemoveCache($"{CacheConstants.GetDatatableById}-{notification.table.Id}");
        await _redisCache.RemoveCache(CacheConstants.GetDatatablesWithRelationships);
    }
}