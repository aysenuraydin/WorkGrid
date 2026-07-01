using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;
namespace workgrid.Infrastructure.Persistence.Configurations;

public class ServiceSectionConfiguration : IEntityTypeConfiguration<ServiceSection>
{
    public void Configure(EntityTypeBuilder<ServiceSection> e)
    {
        e.HasKey(x => x.Id);
        e.HasMany(x => x.Items)
            .WithOne(x => x.ServiceSection)
            .HasForeignKey(x => x.ServiceSectionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}