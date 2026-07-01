using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.Datatables.Commands.ChangeTableHeight;

public class ChangeTableHeightCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public int ModalHeight { get; set; }
}
public class ChangeTableHeightCommandHandler : IRequestHandler<ChangeTableHeightCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public ChangeTableHeightCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(ChangeTableHeightCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tabloyu bul → yoksa NotFound → ChangeHeight → Result.
        throw new NotImplementedException("Source available on request.");
    }
}