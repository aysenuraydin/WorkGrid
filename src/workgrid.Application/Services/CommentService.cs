using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;
using workgrid.DTO.DTOs;
using workgrid.Application.Interfaces;

namespace workgrid.Application.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _repo;
    private readonly IIdentityService _identity;

    public CommentService(ICommentRepository repo, IIdentityService identity)
    {
        _repo = repo;
        _identity = identity;
    }

    public async Task<List<CommentDto>> GetByItemAsync(
        CommentItemTypeEnum itemType, string itemId, CancellationToken ct = default)
    {
        var comments = await _repo.GetByItemAsync(itemType, itemId, ct);
        if (comments.Count == 0) return new List<CommentDto>();

        var userIds = comments.Select(c => c.UserId).Distinct().ToList();
        var userMap = await _identity.GetUsersAsync(userIds, ct);

        return comments.Select(c =>
        {
            userMap.TryGetValue(c.UserId, out var u);

            return new CommentDto
            {
                Id = c.Id,
                ItemId = c.ItemId,
                ItemType = c.ItemType,
                UserId = c.UserId,
                Content = c.Content,
                Rating = c.Rating,
                ParentId = c.ParentId,
                CreatedAt = c.CreatedAt,
                AuthorName = string.IsNullOrWhiteSpace(u.FullName) ? null : u.FullName,
                AuthorAvatarUrl = u.ProfilePictureUrl,
                Images = SplitImages(c.Images),
                Replies = new List<CommentDto>()
            };
        }).ToList();
    }

    public async Task<CommentDto> CreateAsync(
        string userId, CreateCommentDto dto, CancellationToken ct = default)
    {
        var comment = Comment.Create(
            itemId: dto.ItemId,
            itemType: dto.ItemType,
            userId: userId,
            content: dto.Content,
            rating: dto.Rating,
            parentId: dto.ParentId,
            images: dto.Images);

        await _repo.AddAsync(comment, ct);
        await _repo.SaveChangesAsync(ct);

        var userMap = await _identity.GetUsersAsync(new List<string> { userId }, ct);
        userMap.TryGetValue(userId, out var u);

        return new CommentDto
        {
            Id = comment.Id,
            ItemId = comment.ItemId,
            ItemType = comment.ItemType,
            UserId = comment.UserId,
            Content = comment.Content,
            Rating = comment.Rating,
            ParentId = comment.ParentId,
            CreatedAt = comment.CreatedAt,
            AuthorName = string.IsNullOrWhiteSpace(u.FullName) ? null : u.FullName,
            AuthorAvatarUrl = u.ProfilePictureUrl,
            Images = SplitImages(comment.Images),
        };
    }

    public async Task<CommentDto?> UpdateAsync(
        long commentId, string userId, UpdateCommentDto dto, CancellationToken ct = default)
    {
        var comment = await _repo.GetByIdAsync(commentId, ct);
        if (comment is null) return null;

        if (comment.UserId != userId)
            throw new UnauthorizedAccessException("Bu yorumu düzenleme yetkiniz yok.");

        comment.UpdateContent(dto.Content);
        comment.UpdateRating(dto.Rating);

        await _repo.SaveChangesAsync(ct);

        return new CommentDto
        {
            Id = comment.Id,
            ItemId = comment.ItemId,
            ItemType = comment.ItemType,
            UserId = comment.UserId,
            Content = comment.Content,
            Rating = comment.Rating,
            ParentId = comment.ParentId,
            CreatedAt = comment.CreatedAt,
            Images = SplitImages(comment.Images),
        };
    }

    public async Task<bool> DeleteAsync(long commentId, string userId, CancellationToken ct = default)
    {
        var comment = await _repo.GetByIdAsync(commentId, ct);
        if (comment is null) return false;

        if (comment.UserId != userId)
        {
            var isAdmin = await _identity.IsInRoleAsync(userId, "Admin");
            var isWg = await _identity.IsInRoleAsync(userId, "WG");

            if (!isAdmin && !isWg)
                throw new UnauthorizedAccessException("Bu yorumu silme yetkiniz yok.");
        }

        comment.HardDelete();
        _repo.RemoveAsync(comment);
        await _repo.SaveChangesAsync(ct);
        return true;
    }

    private static List<string> SplitImages(string? raw) => string.IsNullOrEmpty(raw)
        ? new List<string>()
        : raw.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(s => s.Trim()).ToList();
}