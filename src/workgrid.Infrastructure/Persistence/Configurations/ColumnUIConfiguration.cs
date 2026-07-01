using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Configurations;

public class ColumnUIConfiguration : IEntityTypeConfiguration<ColumnUIConfig>
{
    public void Configure(EntityTypeBuilder<ColumnUIConfig> builder)
    {
        builder.ToTable(nameof(ColumnUIConfig), "dbo");

        builder.HasKey(c => c.Id);

        builder.HasOne<TableColumn>()
                .WithMany(c => c.UiFk)
                .HasForeignKey(c => c.ColumnId)
                .OnDelete(DeleteBehavior.Cascade);

        builder.Property(c => c.Value).HasMaxLength(500).IsRequired(false);

        builder.Property(c => c.Type)
                .HasConversion<string>()
                .IsRequired();

        builder.HasQueryFilter(c => c.DeletedAt == null);
    }
}