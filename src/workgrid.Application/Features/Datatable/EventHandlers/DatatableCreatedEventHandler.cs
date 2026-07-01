using MediatR;
using Microsoft.Extensions.Logging;
using workgrid.Domain.Events.DatatableEvents;

namespace workgrid.Application.Features.Datatables.EventHandlers;

public class DatatableCreatedEventHandler : INotificationHandler<DatatableCreatedEvent>
{
    private readonly ILogger<DatatableCreatedEventHandler> _logger;

    public DatatableCreatedEventHandler(ILogger<DatatableCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(DatatableCreatedEvent notification, CancellationToken cancellationToken)
    {
        var eventName = notification.GetType().Name;
        _logger.LogInformation($"DatatableCreatedEventHandler is working. Event: {eventName}");

        return Task.CompletedTask;
    }
}