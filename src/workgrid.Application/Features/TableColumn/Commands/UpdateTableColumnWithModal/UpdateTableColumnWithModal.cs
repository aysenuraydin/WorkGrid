using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateTableColumnWithModal;

public class UpdateTableColumnWithModalDesignCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public int? Order { get; set; }
    public int? Width { get; set; }
    public int? SpaceTop { get; set; }
    public int? SpaceBottom { get; set; }
    public int? SpaceLeft { get; set; }
    public int? SpaceRight { get; set; }
    public bool? IsVisible { get; set; }
    public int? X { get; set; }
    public int? Y { get; set; }
    public bool? IsMove { get; set; }
}
public class UpdateTableColumnWithModalDesignCommandHandler : IRequestHandler<UpdateTableColumnWithModalDesignCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateTableColumnWithModalDesignCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateTableColumnWithModalDesignCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolonu modal tasarımıyla bul → yoksa NotFound →
        //   UpdateModalDesign(konum/boyut/boşluk/görünürlük) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}