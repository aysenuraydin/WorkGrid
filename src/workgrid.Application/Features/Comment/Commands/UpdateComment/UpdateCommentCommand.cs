using MediatR;
using Microsoft.EntityFrameworkCore;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Features.Comments.Commands.UpdateComment;

public class UpdateCommentCommand : IRequest<Result<bool>>
{
    public long Id { get; set; }
    public string Content { get; set; } = null!;
    public int? Rating { get; set; }
}

public class UpdateCommentCommandHandler : IRequestHandler<UpdateCommentCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUser _currentUser;

    public UpdateCommentCommandHandler(IUnitOfWork unitOfWork, IUser currentUser)
    {
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<Result<bool>> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: token'dan userId → Comment.Update (rating/içerik kuralları
        //   entity'de) → kaydet. Cache invalidation domain event'te.
        throw new NotImplementedException("Source available on request.");
    }
}