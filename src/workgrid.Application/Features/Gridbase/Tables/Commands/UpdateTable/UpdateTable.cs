using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Enums;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Tables.Commands.UpdateTable;

public class UpdateTableCommand : IRequest<Result<TableSummaryResponse>>
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public ModalSizeType? ModalSize { get; set; }
    public TableViewType? ViewType { get; set; }
    public int? PageSize { get; set; }
    public int? ModalHeight { get; set; }
}
public class UpdateTableCommandHandler : IRequestHandler<UpdateTableCommand, Result<TableSummaryResponse>>
{
    private readonly IGridBaseService _service;
    public UpdateTableCommandHandler(IGridBaseService service) => _service = service;

    public async Task<Result<TableSummaryResponse>> Handle(UpdateTableCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: request → UpdateTableRequest DTO → motor servisinde güncelle →
        //   yoksa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}