using MediatR;
using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Common;
using workgrid.Domain.Entities;
using workgrid.Domain.Events;
namespace workgrid.Application.Features.TableColumns.EventHandlers;

public class TableColumnDeletedEventHandler :
    INotificationHandler<TableColumnDeletedEvent>,
    INotificationHandler<TableColumnHardDeletedEvent>
{
    private readonly IUnitOfWork _unitOfWork;
    public TableColumnDeletedEventHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task Handle(TableColumnDeletedEvent notification, CancellationToken ct)
    {
        await ProcessCleanup(notification.column, ct);
    }

    public async Task Handle(TableColumnHardDeletedEvent notification, CancellationToken ct)
    {
        await ProcessCleanup(notification.column, ct);
    }

    private async Task ProcessCleanup(TableColumn column, CancellationToken ct)
    {
        var referencedColumns = await _unitOfWork.TableColumnRepository
                .GetAll()
                .Where(x => x.RealColumnId == column.Id)
                .ToListAsync(ct);

        foreach (var col in referencedColumns)
        {
            var table = await _unitOfWork.TableRepository
                    .GetAll()
                    .Include(x => x.ForeignTablesFk)
                    .FirstOrDefaultAsync(x => x.Id == col.TableId, ct);

            var foreign = table?.ForeignTablesFk
                    .FirstOrDefault(x => x.DatatableId == col.TableId
                    && x.ForeignTableId == column.TableId);

            if (foreign != null)
            {
                foreign.ClearColumnReferences(col);
                await _unitOfWork.ForeignTableRepository.Update(foreign);
            }
            await _unitOfWork.TableColumnRepository.Delete(col);
        }
    }
}