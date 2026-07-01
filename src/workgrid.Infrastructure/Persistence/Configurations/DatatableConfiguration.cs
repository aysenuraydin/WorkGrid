using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Configurations;

public class DatatableConfiguration : IEntityTypeConfiguration<Datatable>
{
    public void Configure(EntityTypeBuilder<Datatable> builder)
    {
        builder.ToTable(nameof(Datatable), "dbo");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasMany(t => t.ColumnsFk)
            .WithOne(c => c.TableFk)
            .HasForeignKey(c => c.TableId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(t => t.RowsFk)
            .WithOne(r => r.TableFk)
            .HasForeignKey(r => r.TableId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(t => t.ForeignTablesFk)
            .WithOne(ft => ft.DatatableFk)
            .HasForeignKey(ft => ft.DatatableId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(t => t.Name)
            .IsUnique()
            .HasDatabaseName("UX_Datatable_Name");

    }
}