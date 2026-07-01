using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableRowDeletedEvent(TableRow row) : BaseEvent, IImmediateEvent;

