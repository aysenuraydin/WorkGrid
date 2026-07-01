using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableColumnCreatedEvent(TableColumn column) : BaseEvent, IImmediateEvent;


