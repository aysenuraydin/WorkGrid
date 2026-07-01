using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.MenuItems.Commands.ShowOrHideMenuItem;

public class ShowOrHideMenuItemCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public bool Visible { get; set; }
}
public class ShowOrHideMenuItemCommandHandler : IRequestHandler<ShowOrHideMenuItemCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public ShowOrHideMenuItemCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(ShowOrHideMenuItemCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: öğeyi bul → yoksa NotFound → ShowOrHide(visible) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}