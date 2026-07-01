namespace workgrid.Application.Services.Interfaces;

public interface IScopedProcessingService
{
    Task DoWork(CancellationToken stoppingToken);
}