using MediatR;
using Microsoft.EntityFrameworkCore;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Common;

namespace workgrid.Application.Common.Behaviors;

public enum TableAccessType { Read, Write }

public interface ITableScopedRequest
{
    TableAccessType AccessType { get; }

    long? TableIdHint => null;
    long? RowIdHint => null;
    long? ColumnIdHint => null;
    long? CellIdHint => null;
}

public class TableAccessBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ITableAccessGuard _guard;
    private readonly IUnitOfWork _unitOfWork;

    public TableAccessBehavior(ITableAccessGuard guard, IUnitOfWork unitOfWork)
    {
        _guard = guard;
        _unitOfWork = unitOfWork;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (request is not ITableScopedRequest scoped)
            return await next();

        var tableId = await ResolveTableIdAsync(scoped, cancellationToken);
        if (tableId is null)
            return await next();

        var table = await _unitOfWork.TableRepository
            .GetAll()
            .AsNoTracking()
            .Include(t => t.ColumnsFk)
            .FirstOrDefaultAsync(t => t.Id == tableId.Value && t.DeletedAt == null, cancellationToken);

        if (table is null)
            return await next();

        if (scoped.AccessType == TableAccessType.Read)
            _guard.EnsureCanRead(table);
        else
            _guard.EnsureCanWrite(table);

        return await next();
    }

    private async Task<long?> ResolveTableIdAsync(
        ITableScopedRequest scoped, CancellationToken ct)
    {
        if (scoped.TableIdHint is { } tid && tid > 0)
            return tid;

        if (scoped.RowIdHint is { } rowId && rowId > 0)
        {
            var row = await _unitOfWork.TableRowRepository
                .GetAll().AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == rowId, ct);
            return row?.TableId;
        }

        if (scoped.ColumnIdHint is { } colId && colId > 0)
        {
            var col = await _unitOfWork.TableColumnRepository
                .GetAll().AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == colId, ct);
            return col?.TableId;
        }

        if (scoped.CellIdHint is { } cellId && cellId > 0)
        {
            var col = await _unitOfWork.TableColumnRepository
                .GetAll().AsNoTracking()
                .FirstOrDefaultAsync(c => c.CellsFk.Any(ce => ce.Id == cellId), ct);
            return col?.TableId;
        }

        return null;
    }
}