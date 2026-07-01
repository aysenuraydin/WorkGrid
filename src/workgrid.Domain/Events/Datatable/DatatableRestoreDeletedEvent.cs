using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events.DatatableEvents;

public record DatatableRestoreDeletedEvent(Datatable table) : BaseEvent, IImmediateEvent;