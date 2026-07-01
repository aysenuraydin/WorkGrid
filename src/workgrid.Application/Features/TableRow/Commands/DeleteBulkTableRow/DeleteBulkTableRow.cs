using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableRows.Commands.DeleteRow;

public record DeleteBulkTableRowCommand(List<long> Ids, long TableId) : IRequest<Result<bool>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Write;
    public long? TableIdHint => TableId;
}
public class DeleteBulkTableRowCommandHandler : IRequestHandler<DeleteBulkTableRowCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public DeleteBulkTableRowCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(DeleteBulkTableRowCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo+id eşleşen satırları çek → yoksa NotFound →
        //   her birini soft-delete → Result.
        throw new NotImplementedException("Source available on request.");
    }
}