using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;
namespace workgrid.Infrastructure.Persistence.Configurations;

public class TestimonialConfiguration : IEntityTypeConfiguration<Testimonial>
{
    public void Configure(EntityTypeBuilder<Testimonial> e)
    {
        e.HasKey(x => x.Id);

        e.Property(x => x.Name).IsRequired().HasMaxLength(100);
        e.Property(x => x.Comment).IsRequired().HasMaxLength(1000);

        e.Property(x => x.Role).HasMaxLength(100);
        e.Property(x => x.AvatarUrl).HasMaxLength(500);

        e.Property(x => x.Rating).HasDefaultValue(5);
        e.HasCheckConstraint("CK_Testimonial_Rating", "Rating >= 1 AND Rating <= 5");
    }
}