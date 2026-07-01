using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.Domain.Enums;

namespace workgrid.Application.Features.Datatables.Commands.SetTableAccess;

public class SetTableAccessCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public AccessLevel ReadAccess { get; set; }
    public AccessLevel WriteAccess { get; set; }
    public string? ReadRequiredRole { get; set; }
    public string? WriteRequiredRole { get; set; }
    public bool IsOwnerScoped { get; set; }
    public string? OwnerColumn { get; set; }
}
public class SetTableAccessCommandHandler : IRequestHandler<SetTableAccessCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public SetTableAccessCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(SetTableAccessCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tabloyu bul → RoleBased ise rol zorunluluğunu doğrula →
        //   SetAccess (read/write seviye + rol + owner) → commit → Result.
        throw new NotImplementedException("Source available on request.");
    }
}