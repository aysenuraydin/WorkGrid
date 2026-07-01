
using System.ComponentModel.DataAnnotations.Schema;
using workgrid.Domain.Common;

public interface IHasDomainEvents
{
    IReadOnlyCollection<BaseEvent> DomainEvents { get; }
    void ClearDomainEvents();
}
public abstract class BaseEntity<TKey> : IEntity<TKey>, IHasDomainEvents
{
    public TKey Id { get; set; }

    private readonly List<BaseEvent> _domainEvents = new();

    [NotMapped]
    public IReadOnlyCollection<BaseEvent> DomainEvents => _domainEvents.AsReadOnly();

    public void AddDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void RemoveDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Remove(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}
public abstract class BaseEntity : BaseEntity<long>
{


}
public abstract class BaseListEntity : BaseEntity<long>
{
    public string Name { get; set; }
}