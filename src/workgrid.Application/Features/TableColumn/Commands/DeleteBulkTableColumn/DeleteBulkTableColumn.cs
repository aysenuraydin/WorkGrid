using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableColumns.Commands.DeleteColumn;

public record DeleteBulkTableColumnCommand(List<long> Ids, long TableId) : IRequest<Result<bool>>;
public class DeleteBulkTableColumnCommandHandler : IRequestHandler<DeleteBulkTableColumnCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public DeleteBulkTableColumnCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(DeleteBulkTableColumnCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo+id eşleşen kolonları çek → yoksa NotFound →
        //   her birini soft-delete → Result.
        throw new NotImplementedException("Source available on request.");
    }
}