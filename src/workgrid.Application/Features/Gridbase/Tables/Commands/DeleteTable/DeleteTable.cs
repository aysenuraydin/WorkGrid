using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Application.Features.Tables.Commands.DeleteTable;

public record DeleteTableCommand(long Id, bool Hard = true) : IRequest<Result<bool>>;
public class DeleteTableCommandHandler : IRequestHandler<DeleteTableCommand, Result<bool>>
{
    private readonly IGridBaseService _service;
    public DeleteTableCommandHandler(IGridBaseService service) => _service = service;

    public async Task<Result<bool>> Handle(DeleteTableCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde tabloyu sil (soft/hard) → yoksa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}