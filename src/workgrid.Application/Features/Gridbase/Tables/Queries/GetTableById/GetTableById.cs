using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Tables.Queries.GetTblById;

public record GetTblByIdQuery(long Id) : IRequest<Result<TableSummaryResponse>>;
public class GetTblByIdQueryHandler : IRequestHandler<GetTblByIdQuery, Result<TableSummaryResponse>>
{
    private readonly IGridBaseService _service;
    public GetTblByIdQueryHandler(IGridBaseService service) => _service = service;

    public async Task<Result<TableSummaryResponse>> Handle(GetTblByIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde tabloyu id ile getir → yoksa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}