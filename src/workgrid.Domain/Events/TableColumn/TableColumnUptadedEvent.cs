using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableColumnUpdatedEvent(TableColumn column) : BaseEvent, IImmediateEvent;