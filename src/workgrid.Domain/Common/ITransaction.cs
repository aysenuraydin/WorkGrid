
using workgrid.Domain.Repositories;

namespace workgrid.Domain.Common;

public interface ITransaction : IDisposable
{
    Task CommitAsync();
    Task RollbackAsync();

}