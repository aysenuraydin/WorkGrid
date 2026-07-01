using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Configurations;

public class ColumnDataConfiguration : IEntityTypeConfiguration<ColumnDataConfig>
{
    public void Configure(EntityTypeBuilder<ColumnDataConfig> builder)
    {
        builder.ToTable(nameof(ColumnDataConfig), "dbo");

        builder.HasKey(c => c.Id);

        builder.HasOne<TableColumn>()
                .WithMany(c => c.DataFk)
                .HasForeignKey(c => c.ColumnId)
                .OnDelete(DeleteBehavior.Cascade);

        builder.Property(c => c.Value).HasMaxLength(500).IsRequired(false);

        builder.Property(c => c.Type)
                .HasConversion<string>()
                .IsRequired();

        builder.HasQueryFilter(c => c.DeletedAt == null);
    }
}