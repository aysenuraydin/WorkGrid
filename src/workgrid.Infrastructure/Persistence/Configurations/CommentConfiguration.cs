using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Configurations;

public class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.ItemId).IsRequired().HasMaxLength(450);
        builder.Property(c => c.UserId).IsRequired().HasMaxLength(450);
        builder.Property(c => c.Content).IsRequired();
        builder.Property(c => c.ItemType).HasConversion<int>(); // enum -> int

        // Sorgu performansı: item bazlı yorum çekimi sık yapılıyor.
        builder.HasIndex(c => new { c.ItemType, c.ItemId });

        // ── Self-referencing: alt yorumlar ──
        builder.HasOne(c => c.Parent)
            .WithMany(c => c.Replies)
            .HasForeignKey(c => c.ParentId)
            .OnDelete(DeleteBehavior.Restrict); // parent silinince child'ları DB cascade etmesin

        // Replies koleksiyonu için backing field ihtiyacı yok; EF otomatik çözer.
    }
}

