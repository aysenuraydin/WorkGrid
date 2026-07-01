using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableRows.Commands.DeleteRow;

public record DeleteTableRowCommand(long Id) : IRequest<Result<bool>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Write;
    public long? RowIdHint => Id;
}
public class DeleteTableRowCommandHandler : IRequestHandler<DeleteTableRowCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public DeleteTableRowCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(DeleteTableRowCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: satırı bul → yoksa NotFound → soft-delete → Result.
        throw new NotImplementedException("Source available on request.");
    }
}