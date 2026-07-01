using MediatR;
using Microsoft.Extensions.Logging;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.Tables.EventHandlers;

public class TableCreatedEventHandler : INotificationHandler<TableCreatedEvent>
{
    private readonly ILogger<TableCreatedEventHandler> _logger;

    public TableCreatedEventHandler(ILogger<TableCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(TableCreatedEvent notification, CancellationToken cancellationToken)
    {
        var eventName = notification.GetType().Name;
        _logger.LogInformation($"TableCreatedEventHandler is working. Event: {eventName}");

        return Task.CompletedTask;
    }
}