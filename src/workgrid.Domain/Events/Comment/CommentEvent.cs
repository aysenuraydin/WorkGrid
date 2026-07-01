
using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Events.CommentEvents;



public record CommentCreatedEvent(Comment Comment) : BaseEvent, IImmediateEvent;
public record CommentUpdatedEvent(Comment Comment) : BaseEvent, IImmediateEvent;
public record CommentDeletedEvent(Comment Comment) : BaseEvent, IImmediateEvent;

