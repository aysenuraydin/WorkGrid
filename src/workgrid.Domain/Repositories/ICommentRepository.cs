using workgrid.Domain.Common;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;

namespace workgrid.Domain.Repositories;

public interface ICommentRepository : IRepository<Comment, long>
{
    Task<List<Comment>> GetByItemAsync(CommentItemTypeEnum itemType, string itemId, CancellationToken ct = default);

    Task<Comment?> GetByIdAsync(long commentId, CancellationToken ct = default);

    Task AddAsync(Comment comment, CancellationToken ct = default);

    Task RemoveAsync(Comment comment);

    Task SaveChangesAsync(CancellationToken ct = default);
}