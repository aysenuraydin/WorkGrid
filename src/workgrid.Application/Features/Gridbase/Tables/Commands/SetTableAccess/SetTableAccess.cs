using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Enums;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Tables.Commands.SetTableAccess;

public class SetTableAccessCommand : IRequest<Result<bool>>
{
    public string TableName { get; set; } = null!;
    public AccessLevel ReadAccess { get; set; }
    public AccessLevel WriteAccess { get; set; }
    public string? ReadRequiredRole { get; set; }
    public string? WriteRequiredRole { get; set; }
    public bool IsOwnerScoped { get; set; }
    public string? OwnerColumn { get; set; }
}
public class SetTableAccessCommandHandler : IRequestHandler<SetTableAccessCommand, Result<bool>>
{
    private readonly IGridBaseService _service;
    public SetTableAccessCommandHandler(IGridBaseService service) => _service = service;

    public async Task<Result<bool>> Handle(SetTableAccessCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: request → SetTableAccessRequest DTO → motor servisinde
        //   tablonun erişim ayarlarını uygula → Success.
        throw new NotImplementedException("Source available on request.");
    }
}