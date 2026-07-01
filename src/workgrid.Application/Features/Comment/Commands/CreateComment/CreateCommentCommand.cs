using MediatR;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.Comments.Commands.CreateComment;

public class CreateCommentCommand : IRequest<Result<long>>
{
    public string ItemId { get; set; } = null!;
    public CommentItemTypeEnum ItemType { get; set; }
    public string Content { get; set; } = null!;
    public int? Rating { get; set; }
    public long? ParentId { get; set; }
    public string? Images { get; set; }
}

public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, Result<long>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUser _currentUser;

    public CreateCommentCommandHandler(IUnitOfWork unitOfWork, IUser currentUser)
    {
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<Result<long>> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: token'dan userId → Comment.Create (rating/içerik kuralları
        //   entity'de) → kaydet. Cache invalidation domain event'te.
        throw new NotImplementedException("Source available on request.");
    }
}