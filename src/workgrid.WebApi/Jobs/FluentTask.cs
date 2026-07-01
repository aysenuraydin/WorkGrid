using FluentScheduler;

namespace workgrid.WebApi.Jobs;

public class MyRegistry : Registry
{
    public MyRegistry(IServiceProvider serviceProvider)
    {
        Schedule(() => new PurgeDeletedDataJob(serviceProvider))
            .ToRunEvery(1).Hours();

        Schedule(() => new ProcessOutboxMessagesJob(serviceProvider))
            .ToRunNow().AndEvery(30).Seconds();
    }
}