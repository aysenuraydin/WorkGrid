using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableColumnWithDesignUpdatedEvent(TableColumn column) : BaseEvent, IImmediateEvent;