using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableColumnWithOptionUpdatedEvent(TableColumn column) : BaseEvent, IImmediateEvent;