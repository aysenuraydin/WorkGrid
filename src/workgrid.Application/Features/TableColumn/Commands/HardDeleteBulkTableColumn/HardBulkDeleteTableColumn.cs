using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableColumns.Commands.DeleteColumn;

public record HardDeleteBulkTableColumnCommand(List<long> Ids, long TableId) : IRequest<Result<bool>>;

public class HardDeleteBulkTableColumnCommandHandler : IRequestHandler<HardDeleteBulkTableColumnCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public HardDeleteBulkTableColumnCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(HardDeleteBulkTableColumnCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablo+id eşleşen kolonları tüm ilişkileriyle çek →
        //   yoksa NotFound → her birini kalıcı sil → Result.
        throw new NotImplementedException("Source available on request.");
    }
}