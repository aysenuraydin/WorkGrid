using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;
namespace workgrid.Infrastructure.Persistence.Configurations;

public class CalendarEventConfiguration : IEntityTypeConfiguration<CalendarEvent>
{
    public void Configure(EntityTypeBuilder<CalendarEvent> builder)
    {
        builder.ToTable("CalendarEvents");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Start)
            .IsRequired();

        builder.Property(e => e.End);

        builder.Property(e => e.ClassName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Location)
            .HasMaxLength(500);

        builder.Property(e => e.Description)
            .HasMaxLength(2000);

        builder.Property(e => e.IsPublic)
            .IsRequired();

        builder.Property(e => e.UserId)
            .IsRequired();
    }
}