using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Application.Features.Relations.Commands.AddRelation;

public class AddRelationCommand : IRequest<Result<bool>>
{
    public string FromTable { get; set; } = null!;
    public string ToTable { get; set; } = null!;
    public bool IsMultiSelect { get; set; }
}
public class AddRelationCommandHandler : IRequestHandler<AddRelationCommand, Result<bool>>
{
    private readonly IGridBaseService _service;
    public AddRelationCommandHandler(IGridBaseService service) => _service = service;

    public async Task<Result<bool>> Handle(AddRelationCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde from→to ilişkisini (tekil/çoklu) kur → Success.
        throw new NotImplementedException("Source available on request.");
    }
}