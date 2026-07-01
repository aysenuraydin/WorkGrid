using workgrid.Application.Services.Interfaces;

namespace workgrid.WebApi.Jobs;

public class ConsumeScopedServiceHostedService : BackgroundService//BackgroundService den kalıtım aldık
{//BackgroundService den kendi içinde IHostedService ve IDisposable i kalıtım alıyor zaten.

    private int executionCount = 0;
    private readonly ILogger<ConsumeScopedServiceHostedService> _logger;
    private Timer? _timer = null;
    public IServiceProvider Services { get; }
    //IServiceProvider ile tanımladığımız tüm servislere eşirebiliriz.
    public ConsumeScopedServiceHostedService(IServiceProvider services,
        ILogger<ConsumeScopedServiceHostedService> logger)
    {
        Services = services;
        _logger = logger;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            "Consume Scoped Service Hosted Service running.");

        await DoWork(stoppingToken);
    }

    private async Task DoWork(CancellationToken stoppingToken)
    { //şu anlık sadece 1 kere çalışacak
        _logger.LogInformation(
            "Consume Scoped Service Hosted Service is working.");

        //!ServiceProvider ile tanımladığımız tüm servislere eşirebiliyorduk.  scopedProcessingService içinde tanımaladığımız DoWork metodunu çalıştırdık.
        //!database, mail ve diğer işlemleri burada yapabiliriz.
        using (var scope = Services.CreateScope())
        {
            var scopedProcessingService =
                scope.ServiceProvider
                    .GetRequiredService<IScopedProcessingService>();

            await scopedProcessingService.DoWork(stoppingToken);
        }
    }

    public override async Task StopAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            "Consume Scoped Service Hosted Service is stopping.");

        await base.StopAsync(stoppingToken);
    }
}