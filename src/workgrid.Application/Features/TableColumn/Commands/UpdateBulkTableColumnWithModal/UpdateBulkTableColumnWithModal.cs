using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateBulkTableColumnWithModal;

public class UpdateBulkTableColumnWithModalDesignCommand : IRequest<Result<bool>>
{
    public long TableId { get; set; }
    public int? ModalHeight { get; set; }
    public List<ColumnDesignItemDto> ColumnDesigns { get; set; }
}
public class UpdateBulkTableColumnWithModalDesignCommandHandler : IRequestHandler<UpdateBulkTableColumnWithModalDesignCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    public UpdateBulkTableColumnWithModalDesignCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<bool>> Handle(UpdateBulkTableColumnWithModalDesignCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: tabloyu kolon+modal tasarımlarıyla çek → yoksa NotFound →
        //   modal yüksekliğini güncelle → kolonları sözlükle eşleştirip her birinin
        //   UpdateModalDesign(konum/boyut/boşluk/görünürlük) → Result.
        throw new NotImplementedException("Source available on request.");
    }
}