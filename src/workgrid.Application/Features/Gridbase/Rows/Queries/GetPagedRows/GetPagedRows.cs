using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Rows.Queries.GetPagedRows;

public class GetPagedRowsQuery : IRequest<Result<PagedResult>>
{
    public string TableName { get; set; } = null!;
    public int Page { get; set; } = 1;
    public int? PageSize { get; set; }
    public IReadOnlyList<FilterDescriptor>? Filters { get; set; }
    public SortDescriptor? Sort { get; set; }
    public SelectDescriptor? Select { get; set; }
    public string? Search { get; set; }
    public IReadOnlyList<string>? SearchFields { get; set; }
    public IReadOnlyList<string>? Expand { get; set; }

    public GetPagedRowsQuery(
        string tableName, int page = 1, int? pageSize = null,
        IReadOnlyList<FilterDescriptor>? filters = null,
        SortDescriptor? sort = null,
        SelectDescriptor? select = null,
        string? search = null,
        IReadOnlyList<string>? searchFields = null,
        IReadOnlyList<string>? expand = null)
    {
        TableName = tableName;
        Page = page;
        PageSize = pageSize;
        Filters = filters;
        Sort = sort;
        Select = select;
        Search = search;
        SearchFields = searchFields;
        Expand = expand;
    }
}
public class GetPagedRowsQueryHandler : IRequestHandler<GetPagedRowsQuery, Result<PagedResult>>
{
    private readonly IGridBaseService _service;
    public GetPagedRowsQueryHandler(IGridBaseService service) => _service = service;

    public async Task<Result<PagedResult>> Handle(GetPagedRowsQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde sayfa/boyut + filtre/sıralama/arama/expand
        //   ile sayfalı sonuç getir → Success.
        throw new NotImplementedException("Source available on request.");
    }
}