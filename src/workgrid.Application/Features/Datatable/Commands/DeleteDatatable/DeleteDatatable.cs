using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.Datatables.Commands.DeleteDatatable;

public record DeleteDatatableCommand(long Id) : IRequest<Result<bool>>;
public class DeleteDatatableCommandHandler : IRequestHandler<DeleteDatatableCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public DeleteDatatableCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(DeleteDatatableCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tabloyu ilişkileriyle bul → yoksa Failure →
        //   bu tabloya işaret eden ters ilişkileri sil → tabloyu soft-delete → Result.
        throw new NotImplementedException("Source available on request.");
    }
}