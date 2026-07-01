using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableRowRestoredDeletedEvent(TableRow row) : BaseEvent, IImmediateEvent;





