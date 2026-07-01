using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Application.Features.Columns.Commands.PruneEmptyColumns;

public class PruneEmptyColumnsCommand : IRequest<Result<IReadOnlyList<long>>>
{
    public long TableId { get; set; }
    public IReadOnlyList<long>? ColumnIds { get; set; }

    public PruneEmptyColumnsCommand(long tableId, IReadOnlyList<long>? columnIds = null)
    {
        TableId = tableId;
        ColumnIds = columnIds;
    }
}
public class PruneEmptyColumnsCommandHandler : IRequestHandler<PruneEmptyColumnsCommand, Result<IReadOnlyList<long>>>
{
    private readonly IGridBaseService _service;
    public PruneEmptyColumnsCommandHandler(IGridBaseService service) => _service = service;

    public async Task<Result<IReadOnlyList<long>>> Handle(PruneEmptyColumnsCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde boş kolonları temizle → silinen id'lerle Success.
        throw new NotImplementedException("Source available on request.");
    }
}