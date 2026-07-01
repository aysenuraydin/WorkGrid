using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Serilog;
using workgrid.Application.Common.Interfaces;
using workgrid.Infrastructure.ConfigModels;
using workgrid.Infrastructure.Constants;

namespace workgrid.Infrastructure.Logging;

public class LogManager : IAppLogger
{
    private readonly IConfiguration _configuration;
    private readonly AppConfigModel? _options;

    public LogManager(IConfiguration configuration, IOptions<AppConfigModel> options)
    {
        _configuration = configuration;
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
    }

    public ILogger CreatePerformanceLogger()
    {
        return new LoggerConfiguration()
            .Enrich.FromLogContext()
            .MinimumLevel.Debug()
            .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", Serilog.Events.LogEventLevel.Warning)
            .WriteTo.File("logs/workgrid-performance-log.txt", rollingInterval: RollingInterval.Day)
            .CreateLogger();
    }

    public ILogger CreateMongoLogger()
    {
        // if (_configuration[ApplicationSettings.IS_REDİS_ACTIVE] == true)
        if (_options?.IsRedisActive != true)
        {
            return new LoggerConfiguration()
                .Enrich.FromLogContext()
                .MinimumLevel.Warning()
                .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", Serilog.Events.LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.AspNetCore", Serilog.Events.LogEventLevel.Warning)
                .MinimumLevel.Override("workgrid.WebApi.Jobs", Serilog.Events.LogEventLevel.Information)
                .WriteTo.MongoDBBson(
                    _configuration[ConnectionSettings.MONGO_CONNECTİON_STRING] + "/" + _configuration[ConnectionSettings.MONGO_DATABASE_NAME],
                    _configuration[ConnectionSettings.MONGO_LOG_COLLECTİON]!)
                .CreateLogger();
        }

        return Log.Logger;
    }
}