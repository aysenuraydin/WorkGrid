using MediatR;
using Microsoft.Extensions.Logging;
using workgrid.Domain.Events;

namespace workgrid.Application.Features.Datatables.EventHandlers;

public class MenuItemCreatedEventHandler : INotificationHandler<MenuItemCreatedEvent>
{
    private readonly ILogger<MenuItemCreatedEventHandler> _logger;

    public MenuItemCreatedEventHandler(ILogger<MenuItemCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(MenuItemCreatedEvent notification, CancellationToken cancellationToken)
    {
        var eventName = notification.GetType().Name;
        _logger.LogInformation($"MenuItemCreatedEventHandler is working. Event: {eventName}");

        return Task.CompletedTask;
    }
}