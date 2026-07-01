using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableColumnWithFunctionUpdatedEvent(TableColumn column) : BaseEvent, IImmediateEvent;