using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.MenuItems.Commands.HardDeleteMenuItem;

public record HardDeleteMenuItemCommand(long Id) : IRequest<Result<bool>>;
public class HardDeleteMenuItemCommandHandler : IRequestHandler<HardDeleteMenuItemCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public HardDeleteMenuItemCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(HardDeleteMenuItemCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: öğeyi bul → yoksa NotFound → kalıcı sil →
        //   alt öğeleri özyinelemeli kalıcı sil → Result.
        throw new NotImplementedException("Source available on request.");
    }
}