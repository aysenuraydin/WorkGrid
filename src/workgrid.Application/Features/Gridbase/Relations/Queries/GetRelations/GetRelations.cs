using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Relations.Queries.GetRelations;

public record GetRelationsQuery(string FromTable)
    : IRequest<Result<IReadOnlyList<RelationInfo>>>;
public class GetRelationsQueryHandler : IRequestHandler<GetRelationsQuery, Result<IReadOnlyList<RelationInfo>>>
{
    private readonly IGridBaseService _service;
    public GetRelationsQueryHandler(IGridBaseService service) => _service = service;

    public async Task<Result<IReadOnlyList<RelationInfo>>> Handle(GetRelationsQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinden tablonun ilişkilerini getir → Success.
        throw new NotImplementedException("Source available on request.");
    }
}