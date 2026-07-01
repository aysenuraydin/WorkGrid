using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableRows.Commands.DeleteRow;

public record HardDeleteTableRowCommand(long RowId) : IRequest<Result<bool>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Write;
    public long? RowIdHint => RowId;
}
public class HardDeleteTableRowCommandHandler : IRequestHandler<HardDeleteTableRowCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public HardDeleteTableRowCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(HardDeleteTableRowCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: satırı hücreleriyle bul → yoksa NotFound → kalıcı sil → Result.
        throw new NotImplementedException("Source available on request.");
    }
}