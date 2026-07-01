using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableCellCreatedEvent(TableCell cell) : BaseEvent, IImmediateEvent;