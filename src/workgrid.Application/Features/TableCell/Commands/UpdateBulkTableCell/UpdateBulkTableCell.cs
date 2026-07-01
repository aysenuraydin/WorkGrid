using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableCells.Commands.UpdateBulkTableCell;

public record UpdateBulkTableCellCommand(List<TableCellUpdateDto> Cells) : IRequest<Result<bool>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Write;
    public long? CellIdHint => Cells?[0].CellId;
}
public class UpdateBulkTableCellCommandHandler : IRequestHandler<UpdateBulkTableCellCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateBulkTableCellCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateBulkTableCellCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: boşsa erken dön → hücre id'lerini topla → satırlarıyla çek →
        //   yoksa NotFound → her hücreyi map'le güncelle + satırı işaretle → Result.
        throw new NotImplementedException("Source available on request.");
    }
}