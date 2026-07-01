using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableRows.Commands.DeleteRow;

public record HardDeleteBulkTableRowCommand(List<long> Ids, long TableId) : IRequest<Result<bool>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Write;
    public long? TableIdHint => TableId;
}
public class HardDeleteBulkTableRowCommandHandler : IRequestHandler<HardDeleteBulkTableRowCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public HardDeleteBulkTableRowCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(HardDeleteBulkTableRowCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo+id eşleşen satırları hücreleriyle çek → yoksa NotFound →
        //   her birini kalıcı sil → Result.
        throw new NotImplementedException("Source available on request.");
    }
}