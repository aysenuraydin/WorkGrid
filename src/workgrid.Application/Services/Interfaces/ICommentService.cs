using workgrid.DTO.DTOs;
namespace workgrid.Application.Services.Interfaces;

public interface ICommentService
{
    Task<List<CommentDto>> GetByItemAsync(CommentItemTypeEnum itemType, string itemId, CancellationToken ct = default);

    Task<CommentDto> CreateAsync(string userId, CreateCommentDto dto, CancellationToken ct = default);

    Task<CommentDto?> UpdateAsync(long commentId, string userId, UpdateCommentDto dto, CancellationToken ct = default);

    Task<bool> DeleteAsync(long commentId, string userId, CancellationToken ct = default);
}
