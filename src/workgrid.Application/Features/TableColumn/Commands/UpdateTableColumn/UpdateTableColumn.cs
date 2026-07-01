using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.Domain.Enums;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateTableColumn;

public class UpdateTableColumnCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public InputTypeEnum Type { get; set; }
    public string Name { get; set; } = null!;
    public int TableOrder { get; set; } = 0;
    public bool IsVisible { get; set; } = false;
    public bool IsFilter { get; set; } = false;
}
public class UpdateTableColumnCommandHandler : IRequestHandler<UpdateTableColumnCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateTableColumnCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateTableColumnCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolonu ilişkileriyle bul → yoksa NotFound →
        //   entity.Update(tip/ad/sıra/görünürlük/filtre) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}