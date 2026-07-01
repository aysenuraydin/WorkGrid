
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using workgrid.Infrastructure.Identity;
using workgrid.Infrastructure.Persistence.Common;
using workgrid.Infrastructure.Persistence.Seeders;

namespace workgrid.Infrastructure.Persistence;

public static class DbInitExtensions
{
    public static async Task InitializeDb(this IApplicationBuilder app)
    {
        var scope = app.ApplicationServices.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<WorkGridDbContext>();

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

        await new DatatableSeeder().Seed(context);
        await new TableColumnSeeder().Seed(context);
        await new ForeignTableSeeder().Seed(context);
        await new CategorySeeder().Seed(context);
        await new IdentitySeeder(userManager, roleManager).Seed(context);
        await new MenuItemSeeder().Seed(context);

    }

    private static async Task ApplyAllSeederFromAssembly(WorkGridDbContext context)
    {
        var seederType = typeof(ISeeder);
        var seeders = Assembly.GetExecutingAssembly().GetTypes()
            .Where(s => seederType.IsAssignableFrom(s)
                        && s != seederType
                        && !s.IsAbstract
                        && !s.IsInterface
                        && s.GetConstructor(Type.EmptyTypes) != null)
            .ToList();

        foreach (var type in seeders)
        {
            try
            {
                var seeder = Activator.CreateInstance(type) as ISeeder;
                if (seeder != null)
                    await seeder.Seed(context);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Seeder çalıştırılamadı: {type.Name} ➜ {ex.Message}");
            }
        }
    }
}
