using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;
using workgrid.Application.Interfaces;

namespace workgrid.Application.Features.Comments.Queries.GetCommentsForAdmin;

// Request açık.
public class GetCommentsForAdminQuery : IRequest<Result<List<CommentAdminDto>>>
{
    public CommentItemTypeEnum ItemType { get; set; }

    public GetCommentsForAdminQuery(CommentItemTypeEnum itemType)
    {
        ItemType = itemType;
    }
}
public class GetCommentsForAdminQueryHandler
    : IRequestHandler<GetCommentsForAdminQuery, Result<List<CommentAdminDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityService _identity;
    private readonly IGridBaseRepository _gridBase;

    public GetCommentsForAdminQueryHandler(
        IUnitOfWork unitOfWork, IIdentityService identity, IGridBaseRepository gridBase)
    {
        _unitOfWork = unitOfWork;
        _identity = identity;
        _gridBase = gridBase;
    }

    public async Task<Result<List<CommentAdminDto>>> Handle(
        GetCommentsForAdminQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: yorumları çek → yazar bilgilerini toplu al →
        //   GridBase tablosundan item adlarını çöz → admin DTO'suna map.
        throw new NotImplementedException("Source available on request.");
    }

    private async Task<Dictionary<long, string>> BuildItemNameMapAsync(
        CommentItemTypeEnum itemType, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: item tipine göre GridBase tablosunu çöz →
        //   ad kolonunu bul → satır id → ad eşlemesi kur.
        throw new NotImplementedException("Source available on request.");
    }

    private static List<string> SplitImages(string? raw) => string.IsNullOrEmpty(raw)
        ? new List<string>()
        : raw.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList();
}