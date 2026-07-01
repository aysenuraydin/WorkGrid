using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Configurations;

public class ForeignTableConfiguration : IEntityTypeConfiguration<ForeignTable>
{
    public void Configure(EntityTypeBuilder<ForeignTable> builder)
    {
        builder.ToTable(nameof(ForeignTable), "dbo");

        builder.HasKey(t => t.Id);

        builder.HasOne(ft => ft.DatatableFk)
            .WithMany(dt => dt.ForeignTablesFk)
            .HasForeignKey(ft => ft.DatatableId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ft => ft.ForeignTableFk)
            .WithMany()
            .HasForeignKey(ft => ft.ForeignTableId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(ft => ft.CreateOrUpdateColumnId)
            .HasMaxLength(4000)
            .IsUnicode(false)
            .IsRequired(false);

        builder.Property(ft => ft.ListColumnIds)
            .HasMaxLength(4000)
            .IsUnicode(false)
            .IsRequired(false);

        builder.Property(ft => ft.SelectedRowIds)
            .HasMaxLength(4000)
            .IsUnicode(false)
            .IsRequired(false);

        builder.Property(ft => ft.IsMultiSelect)
            .IsRequired()
            .HasDefaultValue(false);

        builder.HasQueryFilter(t => t.DeletedAt == null);
    }
}