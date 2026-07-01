using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateBulkTableColumnWithValidation;

public class UpdateBulkTableColumnWithValidationCommand : IRequest<Result<bool>>
{
    public long TableId { get; set; }
    public List<TableColumnWithValidationBulkUpdateDto> Columns { get; set; } = new();
}
public class UpdateBulkTableColumnWithValidationCommandHandler : IRequestHandler<UpdateBulkTableColumnWithValidationCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateBulkTableColumnWithValidationCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateBulkTableColumnWithValidationCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolonları validation+rules ile çek → yoksa NotFound →
        //   sözlükle eşleştir → her kolonun kurallarını çevirip UpdateValidation → Result.
        throw new NotImplementedException("Source available on request.");
    }
}