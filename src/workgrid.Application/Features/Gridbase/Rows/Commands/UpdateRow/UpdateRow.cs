using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Application.Features.Rows.Commands.UpdateRow;

public class UpdateRowCommand : IRequest<Result<IDictionary<string, object?>>>
{
    public string TableName { get; set; } = null!;
    public long Id { get; set; }
    public Dictionary<string, object?> Body { get; set; } = new();

    public UpdateRowCommand(string tableName, long id, Dictionary<string, object?> body)
    {
        TableName = tableName;
        Id = id;
        Body = body;
    }
}
public class UpdateRowCommandHandler : IRequestHandler<UpdateRowCommand, Result<IDictionary<string, object?>>>
{
    private readonly IGridBaseService _service;
    public UpdateRowCommandHandler(IGridBaseService service) => _service = service;

    public async Task<Result<IDictionary<string, object?>>> Handle(UpdateRowCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde satırı gövdeyle güncelle → yoksa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}