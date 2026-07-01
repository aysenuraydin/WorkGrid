using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateTableColumnWithDesign;

public class UpdateTableColumnWithDesignCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public string Class { get; set; }
    public string Styles { get; set; }
    public string Js { get; set; }
}
public class UpdateTableColumnWithDesignCommandHandler : IRequestHandler<UpdateTableColumnWithDesignCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateTableColumnWithDesignCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateTableColumnWithDesignCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolonu bul → yoksa NotFound → UpdateDesign(class/styles/js) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}