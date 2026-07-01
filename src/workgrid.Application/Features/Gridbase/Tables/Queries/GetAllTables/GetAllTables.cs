using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Tables.Queries.GetAllTables;

public class GetAllTablesQuery : IRequest<Result<IReadOnlyList<TableSummaryResponse>>>
{
    public IReadOnlyList<FilterDescriptor>? Filters { get; set; }
    public SortDescriptor? Sort { get; set; }
    public SelectDescriptor? Select { get; set; }

    public GetAllTablesQuery(
        IReadOnlyList<FilterDescriptor>? filters = null,
        SortDescriptor? sort = null,
        SelectDescriptor? select = null)
    {
        Filters = filters;
        Sort = sort;
        Select = select;
    }
}
public class GetAllTablesQueryHandler : IRequestHandler<GetAllTablesQuery, Result<IReadOnlyList<TableSummaryResponse>>>
{
    private readonly IGridBaseService _service;
    public GetAllTablesQueryHandler(IGridBaseService service) => _service = service;

    public async Task<Result<IReadOnlyList<TableSummaryResponse>>> Handle(GetAllTablesQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde filtre/sıralama/select ile tabloları getir → Success.
        throw new NotImplementedException("Source available on request.");
    }
}