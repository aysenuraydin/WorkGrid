using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;
namespace workgrid.Infrastructure.Persistence.Configurations;

public class PlanSectionConfiguration : IEntityTypeConfiguration<PlanSection>
{
    public void Configure(EntityTypeBuilder<PlanSection> e)
    {
        e.HasKey(x => x.Id);
        e.HasMany(x => x.Items)
            .WithOne(x => x.PlanSection)
            .HasForeignKey(x => x.PlanSectionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class PlanItemConfiguration : IEntityTypeConfiguration<PlanItem>
{
    public void Configure(EntityTypeBuilder<PlanItem> e)
    {
        e.HasKey(x => x.Id);
        e.Property(x => x.PriceMonthly).HasColumnType("decimal(18,2)");
        e.Property(x => x.PriceAnnual).HasColumnType("decimal(18,2)");
        e.HasMany(x => x.Features)
            .WithOne(x => x.PlanItem)
            .HasForeignKey(x => x.PlanItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}