using MediatR;
using workgrid.Application.Common.Behaviors;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableRows.Commands.CreateTableRow;

public record CreateTableRowCommand(long Id, List<TableCellDto> CellsFk) : IRequest<Result<long>>, ITableScopedRequest
{
    public TableAccessType AccessType => TableAccessType.Write;
    public long? TableIdHint => Id;
}
public class CreateTableRowCommandHandler : IRequestHandler<CreateTableRowCommand, Result<long>>
{
    private readonly IUnitOfWork _unitOfWork;
    public CreateTableRowCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<long>> Handle(CreateTableRowCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: TableRow.Create → her gelen hücre için TableCell.Create →
        //   satırı kaydet (id için) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}