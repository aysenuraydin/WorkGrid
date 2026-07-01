using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateTableColumn;

public class UpdateBulkTableColumnCommand : IRequest<Result<bool>>
{
    public long TableId { get; set; }
    public List<TableColumnBulkUpdateDto> Columns { get; set; } = new();
}
public class UpdateBulkTableColumnCommandHandler : IRequestHandler<UpdateBulkTableColumnCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateBulkTableColumnCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateBulkTableColumnCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tablonun kolonlarını ilişkileriyle çek → yoksa NotFound →
        //   gelen DTO'ları id'ye göre sözlükle → eşleşen her kolonu Update → Result.
        throw new NotImplementedException("Source available on request.");
    }
}