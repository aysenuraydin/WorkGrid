using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Columns.Queries.GetEmptyColumns;

public record GetEmptyColumnsQuery(long TableId)
    : IRequest<Result<IReadOnlyList<EmptyColumnInfo>>>;
public class GetEmptyColumnsQueryHandler : IRequestHandler<GetEmptyColumnsQuery, Result<IReadOnlyList<EmptyColumnInfo>>>
{
    private readonly IGridBaseService _service;
    public GetEmptyColumnsQueryHandler(IGridBaseService service) => _service = service;

    public async Task<Result<IReadOnlyList<EmptyColumnInfo>>> Handle(GetEmptyColumnsQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinden tablonun boş kolonlarını getir → Success.
        throw new NotImplementedException("Source available on request.");
    }
}