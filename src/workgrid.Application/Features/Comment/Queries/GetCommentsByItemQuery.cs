using MediatR;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.DTO.DTOs;
using workgrid.Application.Interfaces;

namespace workgrid.Application.Features.Comments.Queries.GetCommentsByItem;

public class GetCommentsByItemQuery : IRequest<Result<List<CommentDto>>>
{
    public CommentItemTypeEnum ItemType { get; set; }
    public string ItemId { get; set; } = null!;

    public GetCommentsByItemQuery(CommentItemTypeEnum itemType, string itemId)
    {
        ItemType = itemType;
        ItemId = itemId;
    }
}
public class GetCommentsByItemQueryHandler
    : IRequestHandler<GetCommentsByItemQuery, Result<List<CommentDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityService _identity;
    private readonly IAppCache _redisCache;

    public GetCommentsByItemQueryHandler(
        IUnitOfWork unitOfWork, IIdentityService identity, IAppCache redisCache)
    {
        _unitOfWork = unitOfWork;
        _identity = identity;
        _redisCache = redisCache;
    }

    public async Task<Result<List<CommentDto>>> Handle(
        GetCommentsByItemQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: cache anahtarı → cache'te yoksa: yorumları çek →
        //   yazar bilgilerini TEK seferde çek (N+1 yok) → DTO'ya map → cache'le.
        throw new NotImplementedException("Source available on request.");
    }

    private static List<string> SplitImages(string? raw) => string.IsNullOrEmpty(raw)
        ? new List<string>()
        : raw.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList();
}