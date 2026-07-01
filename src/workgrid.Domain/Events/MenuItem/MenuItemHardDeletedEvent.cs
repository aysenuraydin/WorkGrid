using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record MenuItemHardDeletedEvent(MenuItem item) : BaseEvent, IImmediateEvent;