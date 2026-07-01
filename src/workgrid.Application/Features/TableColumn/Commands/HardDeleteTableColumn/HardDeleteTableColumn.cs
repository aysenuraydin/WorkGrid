using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableColumns.Commands.DeleteColumn;

public record HardDeleteTableColumnCommand(long Id) : IRequest<Result<bool>>;
public class HardDeleteTableColumnCommandHandler : IRequestHandler<HardDeleteTableColumnCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public HardDeleteTableColumnCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(HardDeleteTableColumnCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolonu tüm ilişkileriyle çek → yoksa NotFound →
        //   kalıcı sil → Result.
        throw new NotImplementedException("Source available on request.");
    }
}