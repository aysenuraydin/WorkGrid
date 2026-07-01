using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.MenuItems.Commands.UpdateMenuItem;

public class UpdateMenuItemCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public string? Icon { get; set; }
    public string Label { get; set; }
    public string? Link { get; set; }
    public bool Visible { get; set; } = false;
    public string? BadgeColor { get; set; }
    public string? BadgeName { get; set; }
    public bool IsHeader { get; set; } = false;
    public long? ParentId { get; set; }
    public bool Locked { get; set; } = false;
    public bool? IsAdmin { get; set; } = false;
}
public class UpdateMenuItemCommandHandler : IRequestHandler<UpdateMenuItemCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateMenuItemCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateMenuItemCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: öğeyi badge ile bul → yoksa NotFound → badge boşsa
        //   ilişkili badge'i sil → entity.Update(...) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}