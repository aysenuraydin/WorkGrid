using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateTableColumnWithOption;

public class UpdateTableColumnWithOptionCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public List<ColumnUIConfigDto>? UiFk { get; set; } = new List<ColumnUIConfigDto>();
    public List<ColumnDataConfigDto>? DataFk { get; set; } = new List<ColumnDataConfigDto>();
}
public class UpdateTableColumnWithOptionCommandHandler : IRequestHandler<UpdateTableColumnWithOptionCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateTableColumnWithOptionCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateTableColumnWithOptionCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolonu UiFk/DataFk ile bul → yoksa Failure →
        //   gelen UI/Data config'lerini domain tipine çevir → UpdateOptions(ui, data) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}