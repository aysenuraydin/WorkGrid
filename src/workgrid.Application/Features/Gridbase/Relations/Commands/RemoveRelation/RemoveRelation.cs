using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Application.Features.Relations.Commands.RemoveRelation;

public record RemoveRelationCommand(string FromTable, string ToTable) : IRequest<Result<bool>>;
public class RemoveRelationCommandHandler : IRequestHandler<RemoveRelationCommand, Result<bool>>
{
    private readonly IGridBaseService _service;
    public RemoveRelationCommandHandler(IGridBaseService service) => _service = service;

    public async Task<Result<bool>> Handle(RemoveRelationCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinde from→to ilişkisini sil → yoksa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}