
using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;

namespace workgrid.Application.Common.Interfaces;

public interface IWorkGridDbContext
{
    DbSet<MenuItem> MenuItems { get; }
    DbSet<MenuSnapshot> MenuSnapshots { get; }
    DbSet<Badge> Badges { get; }

    DbSet<Datatable> Datatables { get; }
    DbSet<TableColumn> TableColumns { get; }
    DbSet<TableRow> TableRows { get; }
    DbSet<TableCell> TableCells { get; }
    DbSet<User> Users { get; }
    DbSet<ForeignTable> ForeignTables { get; set; }
    DbSet<OutboxMessage> OutboxMessages { get; set; }

    DbSet<DirectMessage> DirectMessages { get; }
    DbSet<Channel> Channels { get; }
    DbSet<ChannelMessage> ChannelMessages { get; }
    DbSet<Group> Groups { get; }
    DbSet<GroupMember> GroupMembers { get; }
    DbSet<GroupMessage> GroupMessages { get; }

    DbSet<Project> Projects { get; }
    DbSet<ProjectMember> ProjectMembers { get; }
    DbSet<KanbanCard> KanbanCards { get; }
    DbSet<KanbanCardBadge> KanbanCardBadges { get; }
    DbSet<KanbanCardMember> KanbanCardMembers { get; }

    DbSet<CalendarEvent> CalendarEvents { get; set; }
    DbSet<TenantConfig> TenantConfigs { get; set; }

    DbSet<Comment> Comments { get; }

    DbSet<BrandConfig> BrandConfigs { get; }
    DbSet<ContactConfig> ContactConfigs { get; }
    DbSet<SocialLink> SocialLinks { get; }
    DbSet<TeamMember> TeamMembers { get; }
    DbSet<ServiceSection> ServiceSections { get; }
    DbSet<ServiceItem> ServiceItems { get; }
    DbSet<PlanSection> PlanSections { get; }
    DbSet<PlanItem> PlanItems { get; }
    DbSet<PlanFeature> PlanFeatures { get; }
    DbSet<FaqCategory> FaqCategories { get; }
    DbSet<FaqQuestion> FaqQuestions { get; }
    DbSet<StatsSection> StatsSections { get; }
    DbSet<Testimonial> Testimonials { get; }
    DbSet<Work> Works { get; }
    DbSet<ClientItem> ClientItems { get; }

    DbSet<FeatureItem> FeatureItems { get; }
    DbSet<FeatureDetail> FeatureDetails { get; }
    DbSet<CtaConfig> CtaConfigs { get; }

    DbSet<LandingHeroConfig> LandingHeroConfigs { get; }
    DbSet<HeroSliderImage> HeroSliderImages { get; }
    DbSet<CommerceConfig> CommerceConfigs { get; }
    DbSet<GalleryItem> GalleryItems { get; }
    DbSet<AboutConfig> AboutConfigs { get; }
    DbSet<Document> Documents { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}