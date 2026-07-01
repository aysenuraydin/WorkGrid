using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableRows.Commands.RestoreDeletedRow;

public record RestoreBulkTableRowCommand(List<long> Ids, long TableId) : IRequest<Result<bool>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Write;
    public long? TableIdHint => TableId;
}
public class RestoreBulkTableRowCommandHandler : IRequestHandler<RestoreBulkTableRowCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public RestoreBulkTableRowCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(RestoreBulkTableRowCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo+id eşleşen satırları (query filtreleri yok sayarak)
        //   hücreleriyle çek → yoksa NotFound → her birini Restore → Result.
        throw new NotImplementedException("Source available on request.");
    }
}