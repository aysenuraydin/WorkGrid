using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateBulkTableColumnWithFunction;

public class UpdateBulkTableColumnWithFunctionCommand : IRequest<Result<bool>>
{
    public long TableId { get; set; }
    public List<TableColumnWithFunctionBulkUpdateDto> Columns { get; set; } = new();
}
public class UpdateBulkTableColumnWithFunctionCommandHandler : IRequestHandler<UpdateBulkTableColumnWithFunctionCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateBulkTableColumnWithFunctionCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateBulkTableColumnWithFunctionCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablonun kolonlarını çek → yoksa NotFound →
        //   sözlükle eşleştir → her kolonun UpdateFunction(text) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}