using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Tables.Queries.GetOneTable;

public class GetOneTableQuery : IRequest<Result<TableSummaryResponse>>
{
    public IReadOnlyList<FilterDescriptor>? Filters { get; set; }
    public SortDescriptor? Sort { get; set; }
    public SelectDescriptor? Select { get; set; }

    public GetOneTableQuery(
        IReadOnlyList<FilterDescriptor>? filters = null,
        SortDescriptor? sort = null,
        SelectDescriptor? select = null)
    {
        Filters = filters;
        Sort = sort;
        Select = select;
    }
}
public class GetOneTableQueryHandler : IRequestHandler<GetOneTableQuery, Result<TableSummaryResponse>>
{
    private readonly IGridBaseService _service;
    public GetOneTableQueryHandler(IGridBaseService service) => _service = service;

    public async Task<Result<TableSummaryResponse>> Handle(GetOneTableQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde filtre/sıralama/select ile tek tabloyu getir →
        //   yoksa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}