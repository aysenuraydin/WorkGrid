using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record TableCreatedEvent(Datatable table) : BaseEvent, IImmediateEvent;