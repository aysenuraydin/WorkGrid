using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Application.Features.Rows.Commands.DeleteRow;

public record DeleteRowCommand(string TableName, long Id) : IRequest<Result<bool>>;
public class DeleteRowCommandHandler : IRequestHandler<DeleteRowCommand, Result<bool>>
{
    private readonly IGridBaseService _service;
    public DeleteRowCommandHandler(IGridBaseService service) => _service = service;

    public async Task<Result<bool>> Handle(DeleteRowCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde satırı sil → yoksa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}