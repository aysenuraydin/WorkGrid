using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateTableColumnWithFunction;

public class UpdateTableColumnWithFunctionCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public string? FunctionText { get; set; }
}
public class UpdateTableColumnWithFunctionCommandHandler : IRequestHandler<UpdateTableColumnWithFunctionCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateTableColumnWithFunctionCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateTableColumnWithFunctionCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolonu bul → yoksa NotFound → UpdateFunction(text) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}