using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Application.Features.Columns.Commands.DeleteColumn;

public record DeleteColumnCommand(string TableName, string ColumnName, bool Hard = true)
    : IRequest<Result<bool>>;
public class DeleteColumnCommandHandler : IRequestHandler<DeleteColumnCommand, Result<bool>>
{
    private readonly IGridBaseService _service;
    public DeleteColumnCommandHandler(IGridBaseService service) => _service = service;

    public async Task<Result<bool>> Handle(DeleteColumnCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde kolonu adıyla sil → bulunamadıysa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}