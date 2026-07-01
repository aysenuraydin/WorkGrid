using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record MenuItemCreatedEvent(MenuItem item) : BaseEvent, IImmediateEvent;