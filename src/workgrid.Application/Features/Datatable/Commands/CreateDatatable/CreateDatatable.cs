using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.Domain.Enums;

namespace workgrid.Application.Features.Datatables.Commands.CreateDatatable;

public class CreateDatatableCommand : IRequest<Result<long>>
{
    public string Name { get; set; }
    public ModalSizeType? ModalSize { get; set; }
    public TableViewType? ViewType { get; set; }
    public int? PageSize { get; set; }
}
public class CreateTableCommandHandler : IRequestHandler<CreateDatatableCommand, Result<long>>
{
    private readonly IUnitOfWork _unitOfWork;
    public CreateTableCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<long>> Handle(CreateDatatableCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException("Source available on request.");
    }
}