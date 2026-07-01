using System.Reflection;

namespace workgrid.WebApi.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddJobs(this IServiceCollection services)
    {
        var jobTypes = Assembly.GetExecutingAssembly().GetTypes()
            .Where(t => typeof(IHostedService).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract);

        foreach (var type in jobTypes)
        {
            services.AddSingleton(typeof(IHostedService), type);
        }

        return services;
    }
}