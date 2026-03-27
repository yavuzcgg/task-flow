using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs.Comment;
using TaskFlow.Application.Interfaces;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Services;

public class CommentService : ICommentService
{
    private readonly AppDbContext _context;

    public CommentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CommentResponse>> GetByTaskAsync(Guid taskItemId)
    {
        return await _context.Comments
            .Where(c => c.TaskItemId == taskItemId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => MapToResponse(c))
            .ToListAsync();
    }

    public async Task<CommentResponse> CreateAsync(Guid taskItemId, CreateCommentRequest request, Guid userId)
    {
        var comment = new Comment
        {
            Content = request.Content,
            TaskItemId = taskItemId,
            AuthorId = userId,
            CreatedBy = userId
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return MapToResponse(comment);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null) return false;

        comment.IsDeleted = true;
        comment.DeletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    private static CommentResponse MapToResponse(Comment comment)
    {
        return new CommentResponse
        {
            Id = comment.Id,
            Content = comment.Content,
            TaskItemId = comment.TaskItemId,
            AuthorId = comment.AuthorId,
            CreatedAt = comment.CreatedAt,
            UpdatedAt = comment.UpdatedAt
        };
    }
}
