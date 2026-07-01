using MediatR;
using workgrid.Application.Common.Constants;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.TableColumns.EventHandlers;

public class UpdateTableColumnWithValidationCacheEventHandler : INotificationHandler<TableColumnWithValidationUpdatedEvent
>
{
    private readonly IAppCache _redisCache;
    public UpdateTableColumnWithValidationCacheEventHandler(IAppCache redisCache)
    {
        _redisCache = redisCache;
    }
    public async Task Handle(TableColumnWithValidationUpdatedEvent
 notification, CancellationToken cancellationToken)
    {
        await _redisCache.RemoveCache($"{CacheConstants.GetTableColumnsByTableId}-{notification.column.TableId}");
    }
}