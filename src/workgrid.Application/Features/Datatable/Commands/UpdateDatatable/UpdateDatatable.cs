using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.Domain.Enums;

namespace workgrid.Application.Features.Datatables.Commands.UpdateDatatable;

public class UpdateDatatableCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public string Name { get; set; }
    public ModalSizeType? ModalSize { get; set; }
    public TableViewType? ViewType { get; set; }
    public int? PageSize { get; set; }
}
public class UpdateDatatableCommandHandler : IRequestHandler<UpdateDatatableCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateDatatableCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateDatatableCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tabloyu ilişkileriyle bul → yoksa NotFound →
        //   entity.Update(ad/size/view/pageSize) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}