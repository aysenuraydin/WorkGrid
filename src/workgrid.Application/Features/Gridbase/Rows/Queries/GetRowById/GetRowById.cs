using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Rows.Queries.GetRowById;

public class GetRowByIdQuery : IRequest<Result<IDictionary<string, object?>>>
{
    public string TableName { get; set; } = null!;
    public long Id { get; set; }
    public SelectDescriptor? Select { get; set; }
    public IReadOnlyList<string>? Expand { get; set; }

    public GetRowByIdQuery(
        string tableName, long id,
        SelectDescriptor? select = null,
        IReadOnlyList<string>? expand = null)
    {
        TableName = tableName;
        Id = id;
        Select = select;
        Expand = expand;
    }
}
public class GetRowByIdQueryHandler : IRequestHandler<GetRowByIdQuery, Result<IDictionary<string, object?>>>
{
    private readonly IGridBaseService _service;
    public GetRowByIdQueryHandler(IGridBaseService service) => _service = service;

    public async Task<Result<IDictionary<string, object?>>> Handle(GetRowByIdQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde satırı id + select/expand ile getir →
        //   yoksa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}