using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Asp.Versioning;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Infrastructure.ConfigModels;
using workgrid.Infrastructure.Jwt;
using workgrid.WebApi.Constants;
using workgrid.WebApi.Infrastructure;
using workgrid.WebApi.Infrastructure.Extensions;
using workgrid.WebApi.Jobs;
using workgrid.WebApi.Filters;
using workgrid.Infrastructure.Services;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddWebApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddJobs();
        services.AddHostedService<RabbitMqConsumerService>();

        services.Configure<MongoDbSettings>(configuration.GetSection(ApplicationSettings.MONGODB_SETTİNGS));

        services.AddHttpContextAccessor();

        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(null));
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
            });
        services.AddEndpointsApiExplorer();

        Log.Logger = new LoggerConfiguration()
            .Enrich.FromLogContext()
            .MinimumLevel.Warning()
            .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", Serilog.Events.LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft.AspNetCore", Serilog.Events.LogEventLevel.Warning)
            .WriteTo.Console()
            .WriteTo.File(
                "logs/workGrid-log.txt",
                rollingInterval: RollingInterval.Day,
                fileSizeLimitBytes: 10 * 1024 * 1024,
                retainedFileCountLimit: 5,
                rollOnFileSizeLimit: true,
                restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Warning)
            .CreateLogger();


        services.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new ApiVersion(1, 0);
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.ReportApiVersions = true;
            options.ApiVersionReader = new UrlSegmentApiVersionReader();
        })
        .AddApiExplorer(options =>
        {
            options.GroupNameFormat = "'v'VVV";
            options.SubstituteApiVersionInUrl = true;
        });

        services.AddCors(options =>
        {
            options.AddPolicy(ApplicationSettings.CORS_KEY, policy =>
            {
                policy.AllowAnyOrigin()//!
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        services.AddScoped<IUser, CurrentUser>();

        services.AddExceptionHandler<GlobalExceptionHandler>();

        services.AddScoped<JwtAccountService>();
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("d9f3b7e1a5c6d4f8g2h1j0k9l8m7n6p5"))
            };
        });
        services.AddSwaggerGen(option =>
        {
            option.CustomSchemaIds(type => type.FullName);
            option.OperationFilter<ArrayQueryFilter>();
            option.MapType<string[]>(() => new OpenApiSchema
            {
                Type = "array",
                Items = new OpenApiSchema { Type = "string" },
                Default = new Microsoft.OpenApi.Any.OpenApiArray()
            });
            option.SwaggerDoc("v1", new OpenApiInfo { Title = "WorkGrid API", Version = "v1" });

            option.DocInclusionPredicate((version, desc) =>
            {
                var model = desc.ActionDescriptor.EndpointMetadata
                    .OfType<ApiVersionAttribute>()
                    .SelectMany(attr => attr.Versions)
                    .ToList();

                if (!model.Any()) return true;
                return model.Any(v => $"v{v}" == version);
            });

            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter a valid token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });
            option.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[]{}
                }
            });
            option.MapType<IFormFile>(() => new OpenApiSchema
            {
                Type = "string",
                Format = "binary"
            });
        });
        services.AddOptions<AppConfigModel>()
                .Bind(configuration.GetSection(ApplicationSettings.APP))
                .ValidateDataAnnotations();

        return services;
    }
}

