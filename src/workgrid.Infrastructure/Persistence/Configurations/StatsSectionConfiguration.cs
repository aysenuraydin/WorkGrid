using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;
namespace workgrid.Infrastructure.Persistence.Configurations;

public class StatsSectionConfiguration : IEntityTypeConfiguration<StatsSection>
{
    public void Configure(EntityTypeBuilder<StatsSection> e)
    {
        e.HasKey(x => x.Id);
    }
}