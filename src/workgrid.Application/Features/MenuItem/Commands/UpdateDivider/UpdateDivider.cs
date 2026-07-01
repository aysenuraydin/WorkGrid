using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.MenuItems.Commands.UpdateDivider;

public class UpdateDividerCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public string Label { get; set; }
    public bool Visible { get; set; } = false;
    public bool IsHeader { get; set; } = true;
    public bool Locked { get; set; } = false;
    public bool? IsAdmin { get; set; } = false;
}
public class UpdateDividerCommandHandler : IRequestHandler<UpdateDividerCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateDividerCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateDividerCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: öğeyi bul → yoksa NotFound → entity.Update(...) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}