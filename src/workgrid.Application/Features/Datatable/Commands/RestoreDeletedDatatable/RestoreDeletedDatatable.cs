using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.Datatables.Commands.RestoreDeletedDatatable;

public record RestoreDeletedDatatableCommand(long Id) : IRequest<Result<bool>>;
public class RestoreDeletedDatatableCommandHandler : IRequestHandler<RestoreDeletedDatatableCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public RestoreDeletedDatatableCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(RestoreDeletedDatatableCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException("Source available on request.");
    }
}