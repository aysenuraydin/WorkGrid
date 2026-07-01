using MediatR;

public interface IImmediateEvent : INotification { }
public interface IOutboxEvent : INotification { }