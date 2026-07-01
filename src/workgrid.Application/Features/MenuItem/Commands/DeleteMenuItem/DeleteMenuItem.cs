using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.MenuItems.Commands.DeleteMenuItem;

public record DeleteMenuItemCommand(long Id) : IRequest<Result<bool>>;
public class DeleteMenuItemCommandHandler : IRequestHandler<DeleteMenuItemCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public DeleteMenuItemCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(DeleteMenuItemCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: öğeyi bul → yoksa NotFound → soft-delete →
        //   alt öğeleri özyinelemeli sil → Result.
        throw new NotImplementedException("Source available on request.");
    }
}