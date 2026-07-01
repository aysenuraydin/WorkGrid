using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.Domain.Enums;

namespace workgrid.Application.Features.TableColumns.Commands.CreateTableColumn;

public class CreateTableColumnCommand : IRequest<Result<long>>
{
    public long TableId { get; set; }
    public InputTypeEnum Type { get; set; }
    public string Name { get; set; } = null!;
    public int TableOrder { get; set; } = 0;
    public bool IsVisible { get; set; } = false;
    public bool IsFilter { get; set; } = false;
}
public class CreateTableColumnCommandHandler : IRequestHandler<CreateTableColumnCommand, Result<long>>
{
    private readonly IUnitOfWork _unitOfWork;
    public CreateTableColumnCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<long>> Handle(CreateTableColumnCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: TableColumn.Create → kaydet (id için) → tablonun
        //   satırlarını çek → her satıra bu kolon için boş hücre aç → Result.
        throw new NotImplementedException("Source available on request.");
    }
}