using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Application.Features.Rows.Commands.PatchRow;

public class PatchRowCommand : IRequest<Result<IDictionary<string, object?>>>
{
    public string TableName { get; set; } = null!;
    public long Id { get; set; }
    public Dictionary<string, object?> Body { get; set; } = new();

    public PatchRowCommand(string tableName, long id, Dictionary<string, object?> body)
    {
        TableName = tableName;
        Id = id;
        Body = body;
    }
}
public class PatchRowCommandHandler : IRequestHandler<PatchRowCommand, Result<IDictionary<string, object?>>>
{
    private readonly IGridBaseService _service;
    public PatchRowCommandHandler(IGridBaseService service) => _service = service;

    public async Task<Result<IDictionary<string, object?>>> Handle(PatchRowCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde satırı kısmi gövdeyle güncelle → yoksa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}