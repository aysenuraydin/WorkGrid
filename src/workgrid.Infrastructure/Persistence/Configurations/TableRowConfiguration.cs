using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;

namespace workgrid.Infrastructure.Persistence.Configurations;

public class TableRowConfiguration : IEntityTypeConfiguration<TableRow>
{
    public void Configure(EntityTypeBuilder<TableRow> builder)
    {
        builder.ToTable(nameof(TableRow), "dbo");

        builder.HasKey(r => r.Id);

        builder.HasMany(r => r.CellsFk)
            .WithOne(c => c.RowFk)
            .HasForeignKey(c => c.RowId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.TableFk)
            .WithMany(t => t.RowsFk)
            .HasForeignKey(r => r.TableId);

    }
}