using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using workgrid.Infrastructure.Constants;

namespace workgrid.Infrastructure.Persistence;

public class WorkGridDbContextFactory : IDesignTimeDbContextFactory<WorkGridDbContext>
{
    public WorkGridDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../workgrid.WebApi"))
            .AddJsonFile("appsettings.json")
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<WorkGridDbContext>();
        optionsBuilder.UseSqlite(
            configuration.GetConnectionString(ConnectionSettings.DB_CONNECTION_KEY)
        );

        return new WorkGridDbContext(optionsBuilder.Options);
    }
}