using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableColumnRestoredDeletedEvent(TableColumn column) : BaseEvent, IImmediateEvent;