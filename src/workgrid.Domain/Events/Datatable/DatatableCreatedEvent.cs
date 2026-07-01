using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events.DatatableEvents;

public record DatatableCreatedEvent(Datatable table) : BaseEvent, IImmediateEvent;