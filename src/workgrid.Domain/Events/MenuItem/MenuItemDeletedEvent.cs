using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record MenuItemDeletedEvent(MenuItem item) : BaseEvent, IImmediateEvent;
