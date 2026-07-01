using System.Reflection;
using FluentValidation;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Behaviours;
using workgrid.Application.Common.Services;
using workgrid.Application.Services;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Common;
using workgrid.Application.Kanban.Interfaces;
using workgrid.Application.Services;
using workgrid.Application.Services.Interfaces;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddTransient<IGridBaseService, GridBaseService>();
        services.AddScoped<ICommentService, CommentService>();
        services.AddScoped<ICommerceService, CommerceService>();
        services.AddTransient<IDatatableService, DatatableService>();
        services.AddTransient<ITableColumnService, TableColumnService>();
        services.AddTransient<ITableRowService, TableRowService>();
        services.AddTransient<ITableCellService, TableCellService>();
        services.AddTransient<IMenuItemService, MenuItemService>();
        services.AddTransient<IBadgeService, BadgeService>();
        services.AddTransient<IKanbanService, KanbanService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<ICalendarService, CalendarService>();

        services.AddScoped<ITenantConfigService, TenantConfigService>();
        services.AddScoped<ILandingHeroService, LandingHeroService>();
        services.AddScoped<ILandingFeaturesService, LandingFeaturesService>();
        services.AddScoped<ICompanyProjectService, CompanyProjectService>();
        services.AddScoped<IClientItemService, ClientItemService>();
        services.AddScoped<ITestimonialService, TestimonialService>();
        services.AddScoped<IServiceSectionService, ServiceSectionService>();
        services.AddScoped<ISocialLinkService, SocialLinkService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<IBrandService, BrandService>();
        services.AddScoped<IStatsSectionService, StatsSectionService>();
        services.AddScoped<IFaqService, FaqService>();
        services.AddScoped<IPlanService, PlanService>();
        services.AddScoped<IGalleryItemService, GalleryItemService>();
        services.AddScoped<IAboutConfigService, AboutConfigService>();
        services.AddScoped<MenuSnapshotService>();
        services.AddScoped<ITableAccessGuard, TableAccessGuard>();
        services.AddScoped<IDocumentService, DocumentService>();

        services.AddTransient<IMongoDbService, MongoDbService>();

        services.AddScoped<IScopedProcessingService, ProcessingService>();

        services.AddScoped(typeof(IService<,>), typeof(BaseService<,>));

        var assembly = Assembly.GetExecutingAssembly();

        services.AddAutoMapper(assembly);

        services.AddValidatorsFromAssembly(assembly);

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);

            cfg.AddOpenBehavior(typeof(UnhandledExceptionBehaviour<,>));

            cfg.AddOpenBehavior(typeof(TableAccessBehavior<,>));

            cfg.AddOpenBehavior(typeof(PerformanceBehaviour<,>));

            cfg.AddOpenBehavior(typeof(ValidationBehaviour<,>));

            cfg.AddOpenBehavior(typeof(TransactionBehavior<,>));

        });

        return services;
    }
}
