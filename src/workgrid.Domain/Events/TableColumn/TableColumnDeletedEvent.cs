using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableColumnDeletedEvent(TableColumn column) : BaseEvent, IImmediateEvent;