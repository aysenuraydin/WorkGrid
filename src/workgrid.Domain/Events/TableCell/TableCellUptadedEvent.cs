using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableCellUpdatedEvent(TableCell cell) : BaseEvent, IImmediateEvent;

