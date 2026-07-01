using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.Datatables.Commands.HardDeleteBulkDatatable;

public record HardDeleteBulkDatatableCommand(List<long> Ids) : IRequest<Result<bool>>;
public class HardDeleteBulkDatatableCommandHandler : IRequestHandler<HardDeleteBulkDatatableCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public HardDeleteBulkDatatableCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(HardDeleteBulkDatatableCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: verilen id'lerin tablolarını çek → yoksa NotFound →
        //   her birini kalıcı sil → Result.
        throw new NotImplementedException("Source available on request.");
    }
}