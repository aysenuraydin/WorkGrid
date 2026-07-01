using MediatR;
using Microsoft.Extensions.Logging;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;
using workgrid.Domain.Events.DatatableEvents;

namespace workgrid.Application.Features.Datatables.EventHandlers;

public class DatatableHardDeleteCacheEventHandler : INotificationHandler<DatatableHardDeletedEvent>
{
    private readonly IAppCache _redisCache;
    private readonly ILogger<DatatableHardDeleteCacheEventHandler> _logger;
    public DatatableHardDeleteCacheEventHandler(IAppCache redisCache, ILogger<DatatableHardDeleteCacheEventHandler> logger)
    {
        _redisCache = redisCache;
        _logger = logger;
    }

    public async Task Handle(DatatableHardDeletedEvent notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache(CacheConstants.GetDeletedDatatables);
    }
}