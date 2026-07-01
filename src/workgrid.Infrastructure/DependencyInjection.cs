using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models.Email;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Common;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Constants;
using workgrid.Infrastructure.Email;
using workgrid.Infrastructure.Identity;
using workgrid.Infrastructure.Identity.Services;
using workgrid.Infrastructure.Logging;
using workgrid.Infrastructure.Persistence;
using workgrid.Infrastructure.Persistence.Common;
using workgrid.Infrastructure.Persistence.Common.Repositories;
using workgrid.Infrastructure.Persistence.Interceptors;
using workgrid.Infrastructure.Persistence.Repositories;
using workgrid.Infrastructure.Repositories;
using workgrid.Infrastructure.Services;
using workgrid.Application.Interfaces;
using workgrid.Domain.Interfaces;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence.Repositories;
using RedisCache = workgrid.Infrastructure.Caching.RedisCache;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        services.AddScoped<ISaveChangesInterceptor, HybridDomainEventInterceptor>();


        services.AddDbContext<WorkGridDbContext>((sp, options) =>
        {
            var interceptors = sp.GetServices<ISaveChangesInterceptor>();
            options.AddInterceptors(interceptors);

            options.UseSqlite(configuration.GetConnectionString(ConnectionSettings.DB_CONNECTION_KEY));
        });

        services.AddScoped<ISqlConnectionFactory>(provider =>
            new SqlConnectionFactory(configuration.GetConnectionString(ConnectionSettings.DB_CONNECTION_KEY)));

        services.AddScoped<IWorkGridDbContext>(provider => provider.GetRequiredService<WorkGridDbContext>());

        services.AddScoped<IGridBaseRepository, GridBaseRepository>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<ITableRepository, TableRepository>();
        services.AddScoped<ITableColumnRepository, TableColumnRepository>();
        services.AddScoped<ITableCellRepository, TableCellRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        services.AddScoped<IColumnDataRepository, ColumnDataRepository>();
        services.AddScoped<IColumnUIRepository, ColumnUIRepository>();

        services.AddScoped<IValidationRepository, ValidationRepository>();
        services.AddScoped<IRulesRepository, RulesRepository>();

        services.AddScoped<IKanbanCardRepository, KanbanCardRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<ICalendarRepository, CalendarRepository>();

        services.AddScoped<ITenantConfigRepository, TenantConfigRepository>();
        services.AddScoped<ILandingHeroRepository, LandingHeroRepository>();
        services.AddScoped<ILandingFeaturesRepository, LandingFeaturesRepository>();
        services.AddScoped<ICompanyProjectRepository, CompanyProjectRepository>();
        services.AddScoped<IClientItemRepository, ClientItemRepository>();
        services.AddScoped<ITestimonialRepository, TestimonialRepository>();
        services.AddScoped<IServiceRepository, ServiceRepository>();
        services.AddScoped<ISocialLinkRepository, SocialLinkRepository>();
        services.AddScoped<IContactRepository, ContactRepository>();
        services.AddScoped<IBrandRepository, BrandRepository>();
        services.AddScoped<IStatsSectionRepository, StatsSectionRepository>();
        services.AddScoped<IFaqRepository, FaqRepository>();
        services.AddScoped<IPlanRepository, PlanRepository>();
        services.AddScoped<ICommerceRepository, CommerceRepository>();
        services.AddScoped<IGalleryItemRepository, GalleryItemRepository>();
        services.AddScoped<IAboutConfigRepository, AboutConfigRepository>();
        services.AddScoped<IDocumentRepository, DocumentRepository>();

        services.AddScoped(typeof(IRepository<,>), typeof(BaseRepository<,>));

        services.AddSingleton<TimeProvider>(TimeProvider.System);
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddDatabaseDeveloperPageExceptionFilter();

        services
        .AddDefaultIdentity<ApplicationUser>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.Password.RequiredLength = 8;
        })
        .AddRoles<ApplicationRole>()
        .AddRoleManager<RoleManager<ApplicationRole>>()
        .AddEntityFrameworkStores<WorkGridDbContext>();

        var redisConnection = configuration["RedisConnection"];
        services.AddSingleton<IConnectionMultiplexer>(
            ConnectionMultiplexer.Connect(redisConnection!)
        );

        services.AddScoped<IAccountService, IdentityAccountService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IChatService, ChatService>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IPresenceService, RedisPresenceService>();

        services.AddSignalR();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IdentitySeeder>();

        services.AddAuthorization();

        services.Configure<EmailSettings>(configuration.GetSection(EmailSettings.SectionName));
        services.AddScoped<IEmailService, EmailService>();

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration[ConnectionSettings.REDİS_CONNECTION];
            options.InstanceName = ConnectionSettings.REDİS_INSTANCE_NAME;
        });
        services.AddScoped<IAppCache, RedisCache>();
        services.AddMemoryCache();

        services.AddSingleton<IAppLogger, LogManager>();

        return services;
    }
}