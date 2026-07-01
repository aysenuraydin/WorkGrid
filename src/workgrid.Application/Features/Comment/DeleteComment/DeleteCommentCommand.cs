using MediatR;
using workgrid.Application.Common.Interfaces;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;
using workgrid.Application.Interfaces;

namespace workgrid.Application.Features.Comments.Commands.DeleteComment;

public record DeleteCommentCommand(long Id) : IRequest<Result<bool>>;
public class DeleteCommentCommandHandler : IRequestHandler<DeleteCommentCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUser _currentUser;
    private readonly IIdentityService _identity;

    public DeleteCommentCommandHandler(
        IUnitOfWork unitOfWork, IUser currentUser, IIdentityService identity)
    {
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
        _identity = identity;
    }

    public async Task<Result<bool>> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: yorumu bul → yoksa NotFound → sahip değilse Admin/WG rol kontrolü
        //   → hard-delete → tüm alt yanıtları recursive sil.
        throw new NotImplementedException("Source available on request.");
    }

    private async Task DeleteWithReplies(long id, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Çocuk yorumları bul → her birini sil → recursive in.
        throw new NotImplementedException("Source available on request.");
    }
}