using MediatR;
using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.Comments.Queries.GetRatingAverages;

public record GetRatingAveragesQuery(CommentItemTypeEnum ItemType, List<string> ItemIds)
    : IRequest<Dictionary<string, double>>;

public class GetRatingAveragesQueryHandler
    : IRequestHandler<GetRatingAveragesQuery, Dictionary<string, double>>
{
    private readonly IUnitOfWork _unitOfWork;
    public GetRatingAveragesQueryHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Dictionary<string, double>> Handle(GetRatingAveragesQuery request, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: item'ın puanlı yorumlarını çek → ortalama + sayım.
        throw new NotImplementedException("Source available on request.");
    }
}