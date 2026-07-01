using FluentScheduler;
using Serilog;
using workgrid.Infrastructure.Hubs;
using workgrid.Infrastructure.Persistence;
using workgrid.WebApi.Constants;
using workgrid.WebApi.Endpoints;
using workgrid.WebApi.Jobs;
using WorkGrid.API.Controllers;

var builder = WebApplication.CreateBuilder(args);
// builder.Services.AddOpenApi();

builder.WebHost.UseUrls(
    builder.Configuration[ApplicationSettings.API_URLS]!
// "http://localhost:5222"
);

builder.Host.UseSerilog();

builder.Services
        .AddApplicationServices()
        .AddInfrastructureServices(builder.Configuration)
        .AddWebApiServices(builder.Configuration);


var app = builder.Build();

// JobManager'ı uygulamanın kendi ServiceProvider'ı ile başlatıyoruz
JobManager.Initialize(new MyRegistry(app.Services));
app.UseExceptionHandler(_ => { });

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors(ApplicationSettings.CORS_KEY);

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    // // app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Workgrid API V1");
        c.RoutePrefix = string.Empty; // root URL’den aç
    });

    try
    {
        await app.InitializeDb();
    }
    catch (Exception ex)
    {
        Console.WriteLine("DB initialization failed: " + ex);
    }
}

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");
app.MapAuthEndpoints();
app.MapFallbackToFile("/app/index.html");

app.Run();



