using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableColumns.Commands.DeleteColumn;

public record DeleteTableColumnCommand(long Id) : IRequest<Result<bool>>;
public class DeleteTableColumnCommandHandler : IRequestHandler<DeleteTableColumnCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public DeleteTableColumnCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(DeleteTableColumnCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolonu bul → yoksa NotFound → soft-delete → Result.
        throw new NotImplementedException("Source available on request.");
    }
}