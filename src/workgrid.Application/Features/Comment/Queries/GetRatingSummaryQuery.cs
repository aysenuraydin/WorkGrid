using MediatR;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Comments.Queries.GetRatingSummary;

public record GetRatingSummaryQuery(CommentItemTypeEnum ItemType, string ItemId)
    : IRequest<RatingSummaryDto>;
public class GetRatingSummaryQueryHandler
: IRequestHandler<GetRatingSummaryQuery, RatingSummaryDto>
{
    private readonly IUnitOfWork _unitOfWork;
    public GetRatingSummaryQueryHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<RatingSummaryDto> Handle(GetRatingSummaryQuery request, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: item'ın puanlı yorumlarını çek → ortalama + sayım.
        throw new NotImplementedException("Source available on request.");
    }
}