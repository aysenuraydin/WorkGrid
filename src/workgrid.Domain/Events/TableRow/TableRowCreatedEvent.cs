using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableRowCreatedEvent(TableRow row) : BaseEvent, IImmediateEvent;






