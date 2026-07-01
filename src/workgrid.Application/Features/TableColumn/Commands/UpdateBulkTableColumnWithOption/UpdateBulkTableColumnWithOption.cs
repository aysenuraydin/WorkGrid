using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateBulkTableColumnWithOption;

public class UpdateBulkTableColumnWithOptionCommand : IRequest<Result<bool>>
{
    public long TableId { get; set; }
    public List<TableColumnWithOptionBulkUpdateDto> Columns { get; set; } = new();
}
public class UpdateBulkTableColumnWithOptionCommandHandler : IRequestHandler<UpdateBulkTableColumnWithOptionCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateBulkTableColumnWithOptionCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateBulkTableColumnWithOptionCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolonları UiFk/DataFk ile çek → yoksa NotFound →
        //   sözlükle eşleştir → her kolonun UI/Data config'lerini çevirip UpdateOptions → Result.
        throw new NotImplementedException("Source available on request.");
    }
}