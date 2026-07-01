using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;

public class BrandConfigConfiguration : IEntityTypeConfiguration<BrandConfig>
{
    public void Configure(EntityTypeBuilder<BrandConfig> e)
    {
        e.HasKey(x => x.Id);
        e.Property(x => x.CompanyName).IsRequired().HasMaxLength(200);
    }
}