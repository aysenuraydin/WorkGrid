using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Rows.Queries.GetAllRows;

public class GetAllRowsQuery : IRequest<Result<IReadOnlyList<IDictionary<string, object?>>>>
{
    public string TableName { get; set; } = null!;
    public IReadOnlyList<FilterDescriptor>? Filters { get; set; }
    public SortDescriptor? Sort { get; set; }
    public SelectDescriptor? Select { get; set; }
    public string? Search { get; set; }
    public IReadOnlyList<string>? SearchFields { get; set; }
    public IReadOnlyList<string>? Expand { get; set; }

    public GetAllRowsQuery(
        string tableName,
        IReadOnlyList<FilterDescriptor>? filters = null,
        SortDescriptor? sort = null,
        SelectDescriptor? select = null,
        string? search = null,
        IReadOnlyList<string>? searchFields = null,
        IReadOnlyList<string>? expand = null)
    {
        TableName = tableName;
        Filters = filters;
        Sort = sort;
        Select = select;
        Search = search;
        SearchFields = searchFields;
        Expand = expand;
    }
}
public class GetAllRowsQueryHandler : IRequestHandler<GetAllRowsQuery, Result<IReadOnlyList<IDictionary<string, object?>>>>
{
    private readonly IGridBaseService _service;
    public GetAllRowsQueryHandler(IGridBaseService service) => _service = service;

    public async Task<Result<IReadOnlyList<IDictionary<string, object?>>>> Handle(GetAllRowsQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException("Source available on request.");
    }
}