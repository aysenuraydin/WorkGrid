using Microsoft.Extensions.Logging;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Application.Services;

public class ProcessingService : IScopedProcessingService
{
    private int executionCount = 0;
    private readonly ILogger<ProcessingService> _logger;
    private Timer? _timer = null;

    public ProcessingService(ILogger<ProcessingService> logger)
    {
        _logger = logger;
    }
    public async Task DoWork(CancellationToken stoppingToken)
    {

        if (DateTime.Now.DayOfWeek == DayOfWeek.Saturday &&
        DateTime.Now.Hour == 10 && DateTime.Now.Minute == 0 &&
        executionCount == 0)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                executionCount++;


                _logger.LogInformation(
                    "Timed Hosted Service is working. Count: {Count}", executionCount);

                await Task.Delay(5000, stoppingToken);
            }
        }
    }
}