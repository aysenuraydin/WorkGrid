using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.Datatables.Commands.HardDeleteDatatable;

public record HardDeleteDatatableCommand(long Id) : IRequest<Result<bool>>;

public class HardDeleteDatatableCommandHandler : IRequestHandler<HardDeleteDatatableCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public HardDeleteDatatableCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(HardDeleteDatatableCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tabloyu bul → yoksa NotFound → HardDelete → kalıcı sil → Result.
        throw new NotImplementedException("Source available on request.");
    }
}