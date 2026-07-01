using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Rows.Queries.GetOneRow;

public class GetOneRowQuery : IRequest<Result<IDictionary<string, object?>>>
{
    public string TableName { get; set; } = null!;
    public IReadOnlyList<FilterDescriptor>? Filters { get; set; }
    public SortDescriptor? Sort { get; set; }
    public SelectDescriptor? Select { get; set; }
    public IReadOnlyList<string>? Expand { get; set; }

    public GetOneRowQuery(
        string tableName,
        IReadOnlyList<FilterDescriptor>? filters = null,
        SortDescriptor? sort = null,
        SelectDescriptor? select = null,
        IReadOnlyList<string>? expand = null)
    {
        TableName = tableName;
        Filters = filters;
        Sort = sort;
        Select = select;
        Expand = expand;
    }
}
public class GetOneRowQueryHandler : IRequestHandler<GetOneRowQuery, Result<IDictionary<string, object?>>>
{
    private readonly IGridBaseService _service;
    public GetOneRowQueryHandler(IGridBaseService service) => _service = service;

    public async Task<Result<IDictionary<string, object?>>> Handle(GetOneRowQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde filtre/sıralama ile satırları getir →
        //   ilkini al → yoksa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}