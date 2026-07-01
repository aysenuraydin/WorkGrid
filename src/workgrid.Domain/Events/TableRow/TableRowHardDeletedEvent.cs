using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableRowHardDeletedEvent(TableRow row) : BaseEvent, IImmediateEvent;



