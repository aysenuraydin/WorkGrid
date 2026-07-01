using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Infrastructure.Identity;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;

namespace workgrid.Infrastructure.Persistence.Configurations;

public class KanbanCardConfiguration : IEntityTypeConfiguration<KanbanCard>
{
    public void Configure(EntityTypeBuilder<KanbanCard> builder)
    {
        builder.ToTable("KanbanCards");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Text)
            .HasMaxLength(1000);

        builder.Property(x => x.PictureUrl)
            .HasMaxLength(500);

        builder.Property(p => p.Status)
            .HasConversion<string>()
            .HasMaxLength(25)
            .HasDefaultValue(KanbanStatus.New)
            .IsRequired();

        builder.Property(p => p.Priority)
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasDefaultValue(PriorityStatus.Medium);

        builder.HasMany(x => x.Badges)
            .WithOne(badge => badge.Card)
            .HasForeignKey(badge => badge.CardId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Members)
            .WithOne(m => m.Card)
            .HasForeignKey(m => m.CardId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(c => c.DeletedAt == null);
    }
}

// ─── KanbanCardBadge ──────────────────────────────────────────────────────────
public class KanbanCardBadgeConfiguration : IEntityTypeConfiguration<KanbanCardBadge>
{
    public void Configure(EntityTypeBuilder<KanbanCardBadge> b)
    {
        b.ToTable("KanbanCardBadges");

        b.HasKey(x => x.Id);

        b.Property(x => x.Label)
            .IsRequired()
            .HasMaxLength(50);
    }
}

// ─── KanbanCardMember ─────────────────────────────────────────────────────────
public class KanbanCardMemberConfiguration : IEntityTypeConfiguration<KanbanCardMember>
{
    public void Configure(EntityTypeBuilder<KanbanCardMember> b)
    {
        b.ToTable("KanbanCardMembers");

        b.HasKey(x => x.Id);

        b.Property(x => x.UserId)
            .IsRequired();

        // Aynı kullanıcı aynı karta iki kez atanamaz
        b.HasIndex(x => new { x.CardId, x.UserId }).IsUnique();

        // UserId → AspNetUsers
        // b.HasOne<ApplicationUser>()
        //     .WithMany()
        //     .HasForeignKey(x => x.UserId)
        //     .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(p => p.Description)
            .HasMaxLength(500);

        builder.HasMany(p => p.Cards)
            .WithOne()
            .HasForeignKey(c => c.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(p => p.Status)
            .HasConversion<string>()
            .HasMaxLength(25)
            .HasDefaultValue(ProjectStatus.Planning);

        builder.Property(p => p.Priority)
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasDefaultValue(PriorityStatus.Medium);

        builder.HasQueryFilter(c => c.DeletedAt == null);
    }
}

public class ProjectMemberConfiguration : IEntityTypeConfiguration<ProjectMember>
{
    public void Configure(EntityTypeBuilder<ProjectMember> builder)
    {
        builder.ToTable("ProjectMembers");

        builder.HasKey(pm => pm.Id);

        builder.HasIndex(pm => new { pm.ProjectId, pm.UserId }).IsUnique();

        builder.HasOne(pm => pm.Project)
            .WithMany(p => p.Members)
            .HasForeignKey(pm => pm.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        // builder.HasOne<ApplicationUser>()
        //     .WithMany()
        //     .HasForeignKey(pm => pm.UserId)
        //     .OnDelete(DeleteBehavior.Cascade);
    }
}