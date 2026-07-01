using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableColumns.Commands.RestoreBulkTableColumn;

public record RestoreBulkTableColumnCommand(List<long> Ids, long TableId) : IRequest<Result<bool>>;
public class RestoreBulkTableColumnCommandHandler : IRequestHandler<RestoreBulkTableColumnCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public RestoreBulkTableColumnCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(RestoreBulkTableColumnCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo+id eşleşen kolonları (query filtreleri yok sayarak)
        //   hücreleriyle çek → yoksa NotFound → her birini Restore → Result.
        throw new NotImplementedException("Source available on request.");
    }
}