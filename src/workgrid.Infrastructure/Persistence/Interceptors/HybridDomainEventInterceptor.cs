using MediatR;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Newtonsoft.Json;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Interceptors;

public sealed class HybridDomainEventInterceptor : SaveChangesInterceptor
{
    private readonly IMediator _mediator;

    public HybridDomainEventInterceptor(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        var context = eventData.Context;
        if (context is null) return await base.SavingChangesAsync(eventData, result, cancellationToken);

        var entities = context.ChangeTracker
            .Entries<IHasDomainEvents>()
            .Where(e => e.Entity.DomainEvents.Any())
            .Select(e => e.Entity)
            .ToList();

        var allEvents = entities.SelectMany(e => e.DomainEvents).ToList();

        var immediateEvents = allEvents.OfType<IImmediateEvent>().ToList();
        foreach (var @event in immediateEvents)
        {
            await _mediator.Publish(@event, cancellationToken);
        }

        var outboxEvents = allEvents.OfType<IOutboxEvent>().ToList();
        if (outboxEvents.Any())
        {
            var outboxMessages = outboxEvents.Select(@event => new OutboxMessage
            {
                Id = Guid.NewGuid(),
                CreatedAtUtc = DateTime.UtcNow,
                Type = @event.GetType().Name,
                Content = JsonConvert.SerializeObject(@event, new JsonSerializerSettings
                {
                    TypeNameHandling = TypeNameHandling.All
                })
            }).ToList();
            context.Set<OutboxMessage>().AddRange(outboxMessages);
        }

        entities.ForEach(e => e.ClearDomainEvents());

        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}