
using System.ComponentModel.DataAnnotations.Schema;

namespace workgrid.Domain.Common;

public interface IAuditableEntity
{
    DateTime CreatedAt { get; set; }
    string? CreatedBy { get; set; }
    string? CreatedByUserId { get; set; }

    DateTime? LastModifiedAt { get; set; }
    string? LastModifiedBy { get; set; }
    string? LastModifiedByUserId { get; set; }

    DateTime? DeletedAt { get; set; }
    string? DeletedBy { get; set; }
    string? DeletedByUserId { get; set; }


    [NotMapped]
    public bool IsHardDelete { get; set; }
}