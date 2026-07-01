using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using workgrid.FileApi.Data;
using workgrid.FileApi.Constants;
using workgrid.FileApi.Modules;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<FileDbContext>(opt =>
{
    opt.UseSqlite(
        builder.Configuration.GetConnectionString(ConnectionSettings.DB_CONNECTION),
        b => b.MigrationsAssembly("workgrid.FileApi")
    );
});

builder.Services.AddScoped<IFileService, FileService>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy(ApplicationSettings.CORS_KEY, policy =>
    {
        // policy.WithOrigins(configuration[ApplicationSettings.CLIENT_URLS]!.Split(','))
        //     .AllowAnyHeader()
        //     .AllowAnyMethod();
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Workgrid File API",
        Version = "v1"
    });

    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Bearer {token}",
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
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Workgrid File API v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(ApplicationSettings.CORS_KEY);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();