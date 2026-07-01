using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableColumnHardDeletedEvent(TableColumn column) : BaseEvent, IImmediateEvent;