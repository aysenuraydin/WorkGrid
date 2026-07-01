using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record MenuItemRestoredDeletedEvent(MenuItem item) : BaseEvent, IImmediateEvent;