using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record MenuItemUpdatedEvent(MenuItem item) : BaseEvent, IImmediateEvent;