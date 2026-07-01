using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using workgrid.Application.Common.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Infrastructure.Identity;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence;

public class WorkGridDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>, IWorkGridDbContext
{
    public WorkGridDbContext(DbContextOptions<WorkGridDbContext> options) : base(options)
    {
    }
    public DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<MenuSnapshot> MenuSnapshots { get; set; }
    public DbSet<Badge> Badges { get; set; }


    public DbSet<Datatable> Datatables { get; set; }

    public DbSet<TableColumn> TableColumns { get; set; }

    public DbSet<TableRow> TableRows { get; set; }

    public DbSet<TableCell> TableCells { get; set; }

    public DbSet<ForeignTable> ForeignTables { get; set; }

    public DbSet<User> Users { get; set; }
    public DbSet<OutboxMessage> OutboxMessages { get; set; }

    public DbSet<DirectMessage> DirectMessages => Set<DirectMessage>();
    public DbSet<Channel> Channels => Set<Channel>();
    public DbSet<ChannelMessage> ChannelMessages => Set<ChannelMessage>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<GroupMember> GroupMembers => Set<GroupMember>();
    public DbSet<GroupMessage> GroupMessages => Set<GroupMessage>();

    public DbSet<KanbanCard> KanbanCards => Set<KanbanCard>();
    public DbSet<KanbanCardBadge> KanbanCardBadges => Set<KanbanCardBadge>();
    public DbSet<KanbanCardMember> KanbanCardMembers => Set<KanbanCardMember>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();


    public DbSet<Comment> Comments => Set<Comment>();

    public DbSet<CalendarEvent> CalendarEvents { get; set; }
    public DbSet<TenantConfig> TenantConfigs { get; set; }


    public DbSet<BrandConfig> BrandConfigs => Set<BrandConfig>();
    public DbSet<ContactConfig> ContactConfigs => Set<ContactConfig>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<ServiceSection> ServiceSections => Set<ServiceSection>();
    public DbSet<ServiceItem> ServiceItems => Set<ServiceItem>();
    public DbSet<PlanSection> PlanSections => Set<PlanSection>();
    public DbSet<PlanItem> PlanItems => Set<PlanItem>();
    public DbSet<PlanFeature> PlanFeatures => Set<PlanFeature>();
    public DbSet<FaqCategory> FaqCategories => Set<FaqCategory>();
    public DbSet<FaqQuestion> FaqQuestions => Set<FaqQuestion>();
    public DbSet<StatsSection> StatsSections => Set<StatsSection>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<Work> Works => Set<Work>();
    public DbSet<ClientItem> ClientItems => Set<ClientItem>();

    public DbSet<FeatureItem> FeatureItems => Set<FeatureItem>();
    public DbSet<FeatureDetail> FeatureDetails => Set<FeatureDetail>();
    public DbSet<CtaConfig> CtaConfigs => Set<CtaConfig>();

    public DbSet<LandingHeroConfig> LandingHeroConfigs => Set<LandingHeroConfig>();
    public DbSet<HeroSliderImage> HeroSliderImages => Set<HeroSliderImage>();
    public DbSet<CommerceConfig> CommerceConfigs => Set<CommerceConfig>();

    public DbSet<GalleryItem> GalleryItems => Set<GalleryItem>();
    public DbSet<AboutConfig> AboutConfigs => Set<AboutConfig>();
    public DbSet<Document> Documents => Set<Document>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WorkGridDbContext).Assembly);
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        //   var cs = "Data Source=workgrid.db";
        //   optionsBuilder.UseSqlite(cs);

    }
}