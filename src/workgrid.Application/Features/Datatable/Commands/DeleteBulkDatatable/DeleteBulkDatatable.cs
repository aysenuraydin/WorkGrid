using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.Datatables.Commands.DeleteBulkDatatable;

public record DeleteBulkDatatableCommand(List<long> Ids) : IRequest<Result<bool>>;
public class DeleteBulkDatatableCommandHandler : IRequestHandler<DeleteBulkDatatableCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public DeleteBulkDatatableCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(DeleteBulkDatatableCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: verilen id'lerin tablolarını ilişkileriyle çek →
        //   yoksa NotFound → her birini soft-delete → Result.
        throw new NotImplementedException("Source available on request.");
    }
}