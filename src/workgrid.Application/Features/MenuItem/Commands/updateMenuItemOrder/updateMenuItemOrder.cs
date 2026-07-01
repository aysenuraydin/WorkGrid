using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.MenuItems.Commands.updateMenuItemOrder;

public class updateMenuItemOrderCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public int Order { get; set; }
}
public class UpdateMenuItemOrderCommandHandler : IRequestHandler<updateMenuItemOrderCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateMenuItemOrderCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(updateMenuItemOrderCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: öğeyi ve kardeşlerini bul → yeni/eski sıra farkına göre
        //   aradaki kardeşleri kaydır (+1/-1) → öğenin sırasını güncelle → Result.
        throw new NotImplementedException("Source available on request.");
    }
}