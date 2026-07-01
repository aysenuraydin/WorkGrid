using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.Datatables.Commands.RestoreDeletedMenuItem;

public record RestoreDeletedMenuItemCommand(long Id) : IRequest<Result<bool>>;
public class RestoreDeletedMenuItemCommandHandler : IRequestHandler<RestoreDeletedMenuItemCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public RestoreDeletedMenuItemCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(RestoreDeletedMenuItemCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: öğeyi bul → yoksa NotFound → Restore →
        //   alt öğeleri Restore → Result.
        throw new NotImplementedException("Source available on request.");
    }
}