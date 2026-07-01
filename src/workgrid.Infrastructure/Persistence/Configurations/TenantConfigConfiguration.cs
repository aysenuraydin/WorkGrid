using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Configurations
{
    public class TenantConfigConfiguration : IEntityTypeConfiguration<TenantConfig>
    {
        public void Configure(EntityTypeBuilder<TenantConfig> builder)
        {
            builder.ToTable("TenantConfigs");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.PrimaryColor).HasMaxLength(50);
            builder.Property(x => x.SecondaryColor).HasMaxLength(50);

            builder.Property(x => x.CreatedAt).IsRequired();

        }
    }
}