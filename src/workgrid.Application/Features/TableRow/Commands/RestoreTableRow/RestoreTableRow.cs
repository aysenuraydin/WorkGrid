using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableRows.Commands.RestoreDeletedRow;

public record RestoreTableRowCommand(long RowId) : IRequest<Result<bool>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Write;
    public long? RowIdHint => RowId;
}
public class RestoreTableRowCommandHandler : IRequestHandler<RestoreTableRowCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public RestoreTableRowCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(RestoreTableRowCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: satırı (query filtreleri yok sayarak) hücreleriyle bul →
        //   yoksa NotFound → Restore → Result.
        throw new NotImplementedException("Source available on request.");
    }
}