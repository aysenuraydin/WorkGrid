using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.MenuItems.Commands.ChangePrivacyMenuItem;

public class ChangePrivacyMenuItemCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public bool IsAdmin { get; set; }
}
public class ChangePrivacyMenuItemCommandHandler : IRequestHandler<ChangePrivacyMenuItemCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public ChangePrivacyMenuItemCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(ChangePrivacyMenuItemCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: öğeyi bul → yoksa NotFound → ChangePrivacy(isAdmin) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}