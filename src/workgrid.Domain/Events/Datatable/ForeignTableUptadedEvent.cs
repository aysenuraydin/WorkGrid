using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events.DatatableEvents;

public record ForeignTableUpdatedEvent(Datatable table) : BaseEvent, IImmediateEvent;