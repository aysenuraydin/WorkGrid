using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableColumnWithModalUpdatedEvent(TableColumn column) : BaseEvent, IImmediateEvent;