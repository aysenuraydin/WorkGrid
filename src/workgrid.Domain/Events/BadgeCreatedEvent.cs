using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events;

public record BadgeCreatedEvent(Badge badge) : BaseEvent, IImmediateEvent;