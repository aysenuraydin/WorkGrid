using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateBulkTableColumnWithDesign;

public class UpdateBulkTableColumnWithDesignCommand : IRequest<Result<bool>>
{
    public long TableId { get; set; }
    public List<TableColumnWithDesignBulkUpdateDto> Columns { get; set; } = new();
}
public class UpdateBulkTableColumnWithDesignCommandHandler : IRequestHandler<UpdateBulkTableColumnWithDesignCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateBulkTableColumnWithDesignCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateBulkTableColumnWithDesignCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolonları DesignFk ile çek → yoksa NotFound →
        //   sözlükle eşleştir → her kolonun UpdateDesign(class/styles/js) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}