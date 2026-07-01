
using System.ComponentModel.DataAnnotations.Schema;

namespace workgrid.Domain.Common;

public abstract class BaseAuditableEntity<TKey> : BaseEntity<TKey>, IAuditableEntity, IEntity<TKey>
{
    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? CreatedByUserId { get; set; }
    public DateTime? LastModifiedAt { get; set; }
    public string? LastModifiedBy { get; set; }
    public string? LastModifiedByUserId { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
    public string? DeletedByUserId { get; set; }

    [NotMapped]
    public bool IsHardDelete { get; set; }
}

public abstract class BaseAuditableEntity : BaseAuditableEntity<long>
{
}