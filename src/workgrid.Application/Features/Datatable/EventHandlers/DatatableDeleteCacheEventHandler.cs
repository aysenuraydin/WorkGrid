using MediatR;
using Microsoft.Extensions.Logging;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events.DatatableEvents;

namespace workgrid.Application.Features.Datatables.EventHandlers;

public class DatatableCacheEventHandler : INotificationHandler<DatatableDeletedEvent>
{
    private readonly IAppCache _redisCache;
    private readonly ILogger<DatatableCacheEventHandler> _logger;
    public DatatableCacheEventHandler(IAppCache redisCache, ILogger<DatatableCacheEventHandler> logger)
    {
        _redisCache = redisCache;
        _logger = logger;
    }

    public async Task Handle(DatatableDeletedEvent notification, CancellationToken cancellationToken)
    {
        Console.WriteLine("DatatableDeletedEvent ÇALIŞTI. " + notification.table.Name + " İSİMLİ TABLO SİLİNDİ.");
        _logger.LogInformation("DatatableDeletedEvent ÇALIŞTI. {TableName} İSİMLİ TABLO SİLİNDİ.", notification.table.Name);

        var id = notification.table.Id;
        await _redisCache.RemoveCache(CacheConstants.GetDatatables);
        await _redisCache.RemoveCache(CacheConstants.GetDeletedDatatables);
        await _redisCache.RemoveCache(CacheConstants.GetDatatablesWithRelationships);

        await _redisCache.RemoveCache(CacheConstants.GetAllTableColumns);
        await _redisCache.RemoveCache($"{CacheConstants.GetTableColumnsByTableId}-{id}");
        await _redisCache.RemoveCache($"{CacheConstants.GetTableRowsByTableId}-{id}");
    }
}