using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Configurations;

public class TableColumnConfiguration : IEntityTypeConfiguration<TableColumn>
{
    public void Configure(EntityTypeBuilder<TableColumn> builder)
    {
        builder.ToTable(nameof(TableColumn), "dbo");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Type)
            .IsRequired();

        builder.OwnsOne(c => c.ModalDesignFk);

        builder.HasOne(c => c.TableFk)
            .WithMany(t => t.ColumnsFk)
            .HasForeignKey(c => c.TableId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(col => col.CellsFk)
            .WithOne(cell => cell.ColumnFk)
            .HasForeignKey(cell => cell.ColumnId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.ValidationFk)
            .WithOne()
            .HasForeignKey<ColumnValidationConfig>("ColumnId")
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);

        builder.OwnsOne(c => c.DesignFk, design =>
        {
            design.Property(d => d.Class).HasColumnType("text").IsRequired(false); ;
            design.Property(d => d.Styles).HasColumnType("text").IsRequired(false); ;
            design.Property(d => d.Js).HasColumnType("text").IsRequired(false); ;
        });
        builder.HasMany(c => c.UiFk)
            .WithOne()
            .HasForeignKey("ColumnId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(c => c.DataFk)
            .WithOne()
            .HasForeignKey("ColumnId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => new { c.TableId, c.Name })
            .IsUnique()
            .HasDatabaseName("UX_TableColumn_TableId_Name");

        // builder.HasQueryFilter(c => c.DeletedAt == null);
    }
}