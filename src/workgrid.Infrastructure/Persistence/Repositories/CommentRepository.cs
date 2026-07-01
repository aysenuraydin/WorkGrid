using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence;
using workgrid.Infrastructure.Persistence.Common.Repositories;

namespace workgrid.Infrastructure.Repositories;


public class CommentRepository : BaseRepository<Comment, long>, ICommentRepository
{
    private readonly WorkGridDbContext _db;
    public CommentRepository(WorkGridDbContext db) : base(db)
    {

    }
    public async Task<List<Comment>> GetByItemAsync(
        CommentItemTypeEnum itemType, string itemId, CancellationToken ct = default)
    {
        return await _db.Comments
            .Where(c => c.ItemType == itemType
                    && c.ItemId == itemId
                    && c.DeletedAt == null)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<Comment?> GetByIdAsync(long commentId, CancellationToken ct = default)
    {
        return await _db.Comments
            .FirstOrDefaultAsync(c => c.Id == commentId && c.DeletedAt == null, ct);
    }

    public async Task AddAsync(Comment comment, CancellationToken ct = default)
    {
        await _db.Comments.AddAsync(comment, ct);
    }

    public Task RemoveAsync(Comment comment)
    {
        _db.Comments.Remove(comment);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _db.SaveChangesAsync(ct);
    }
}