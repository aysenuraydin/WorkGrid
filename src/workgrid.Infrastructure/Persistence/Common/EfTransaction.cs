using Microsoft.EntityFrameworkCore.Storage;
using workgrid.Domain.Common;

public class EfTransaction : ITransaction
{
    private readonly IDbContextTransaction _transaction;

    public EfTransaction(IDbContextTransaction transaction)
    {
        _transaction = transaction;
    }

    public Task CommitAsync() => _transaction.CommitAsync();
    public Task RollbackAsync() => _transaction.RollbackAsync();
    public void Dispose() => _transaction.Dispose();
}