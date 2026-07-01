using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.MenuItems.Commands.CreateMenuItem;

public class CreateMenuItemCommand : IRequest<Result<long>>
{
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
public class CreateeMenuItemCommandHandler : IRequestHandler<CreateMenuItemCommand, Result<long>>
{
    private readonly IUnitOfWork _unitOfWork;
    public CreateeMenuItemCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<long>> Handle(CreateMenuItemCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: aynı parent altındaki max sırayı bul → MenuItem.Create
        //   (sıra+1, badge dahil) → kaydet → Result.
        throw new NotImplementedException("Source available on request.");
    }
}