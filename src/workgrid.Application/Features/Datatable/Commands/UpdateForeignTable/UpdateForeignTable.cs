using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Datatables.Commands.UpdateForeignTable;

public class UpdateForeignTableCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public List<CreateForeignTableDto>? ForeignTablesFk { get; set; }
}
public class UpdateForeignTableCommandHandler : IRequestHandler<UpdateForeignTableCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateForeignTableCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateForeignTableCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış (özet): tabloyu ilişkileriyle bul → gelen tanımı self/normal
        //   olarak ayır → silinmiş foreign kolonları temizle → ilişkileri, bağ
        //   kolonlarını, kolon/hücreleri ve parent ilişkisini senkronize et →
        //   kolonları yeniden sırala → entity.UpdateForeignTable() → Result.
        throw new NotImplementedException("Source available on request.");
    }
}