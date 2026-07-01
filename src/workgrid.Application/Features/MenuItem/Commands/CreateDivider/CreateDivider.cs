using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.MenuItems.Commands.CreateDivider;

public class CreateDividerCommand : IRequest<Result<long>>
{
    public string Label { get; set; }
    public bool Visible { get; set; } = false;
    public bool IsHeader { get; set; } = true;
    public bool Locked { get; set; } = false;
    public bool? IsAdmin { get; set; } = false;
}
public class CreateDividerCommandHandler : IRequestHandler<CreateDividerCommand, Result<long>>
{
    private readonly IUnitOfWork _unitOfWork;
    public CreateDividerCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<long>> Handle(CreateDividerCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: max sırayı bul → MenuItem.Create (header/divider) → kaydet → Result.
        throw new NotImplementedException("Source available on request.");
    }
}