using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.TableColumns.Commands.RestoreTableColumn;

public record RestoreTableColumnCommand(long ColumnId) : IRequest<Result<bool>>;
public class RestoreTableColumnCommandHandler : IRequestHandler<RestoreTableColumnCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public RestoreTableColumnCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(RestoreTableColumnCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: kolonu (query filtreleri yok sayarak) hücreleriyle bul →
        //   yoksa NotFound → Restore → Result.
        throw new NotImplementedException("Source available on request.");
    }
}