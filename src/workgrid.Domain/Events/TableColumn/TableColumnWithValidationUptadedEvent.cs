using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableColumnWithValidationUpdatedEvent(TableColumn column) : BaseEvent, IImmediateEvent;