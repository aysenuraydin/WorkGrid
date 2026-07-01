using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;
namespace workgrid.Infrastructure.Persistence.Configurations;

public class ContactConfiguration : IEntityTypeConfiguration<ContactConfig>
{
    public void Configure(EntityTypeBuilder<ContactConfig> e)
    {
        e.HasKey(x => x.Id);
        e.Property(x => x.Address1).HasMaxLength(300);
        e.Property(x => x.Address2).HasMaxLength(300);
        e.Property(x => x.WorkingHours).HasMaxLength(200);
        e.Property(x => x.Email).HasMaxLength(200);
        e.Property(x => x.Phone).HasMaxLength(50);
    }
}