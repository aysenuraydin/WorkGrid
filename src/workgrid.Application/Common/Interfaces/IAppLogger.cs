using Serilog;

namespace workgrid.Application.Common.Interfaces;

public interface IAppLogger
{
    ILogger CreateMongoLogger();
    ILogger CreatePerformanceLogger();
}
