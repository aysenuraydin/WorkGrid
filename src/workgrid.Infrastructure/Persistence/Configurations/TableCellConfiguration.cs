using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Configurations;

public class TableCellConfiguration : IEntityTypeConfiguration<TableCell>
{
        public void Configure(EntityTypeBuilder<TableCell> builder)
        {
                builder.ToTable(nameof(TableCell), "dbo");

                builder.HasKey(c => c.Id);

                builder.Property(c => c.Value)
                        .HasMaxLength(500);

                builder.HasOne(c => c.RowFk)
                        .WithMany(r => r.CellsFk)
                        .HasForeignKey(c => c.RowId)
                        .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(c => c.ColumnFk)
                        .WithMany()
                        .HasForeignKey(c => c.ColumnId)
                        .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(c => c.ColumnFk)
                        .WithMany(col => col.CellsFk)
                        .HasForeignKey(c => c.ColumnId)
                        .OnDelete(DeleteBehavior.Cascade);

                builder.HasQueryFilter(c => c.DeletedAt == null);
        }
}