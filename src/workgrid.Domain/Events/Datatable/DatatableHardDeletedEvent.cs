using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events.DatatableEvents;

public record DatatableHardDeletedEvent(Datatable table) : BaseEvent, IImmediateEvent;