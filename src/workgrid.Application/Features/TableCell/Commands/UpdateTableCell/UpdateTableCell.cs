using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableCells.Commands.UpdateTableCell;

public record UpdateTableCellCommand(long CellId, string Value) : IRequest<Result<bool>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Write;
    public long? CellIdHint => CellId;
}
public class UpdateTableCellCommandHandler : IRequestHandler<UpdateTableCellCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateTableCellCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateTableCellCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: hücreyi satırıyla bul → yoksa NotFound →
        //   cell.Update(value) → satırı güncelle → Result.
        throw new NotImplementedException("Source available on request.");
    }
}