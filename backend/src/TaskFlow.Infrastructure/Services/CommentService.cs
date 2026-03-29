using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs.Comment;
using TaskFlow.Application.DTOs.Common;
using TaskFlow.Application.Exceptions;
using TaskFlow.Application.Interfaces;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Services;

public class CommentService : ICommentService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<TaskFlow.Infrastructure.Hubs.TaskHub> _hubContext;

    public CommentService(AppDbContext context, IHubContext<TaskFlow.Infrastructure.Hubs.TaskHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task<PagedResult<CommentResponse>> GetByTaskAsync(Guid taskItemId, PaginationParams pagination)
    {
        var query = _context.Comments
            .Where(c => c.TaskItemId == taskItemId)
            .OrderBy(c => c.CreatedAt);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .Select(c => MapToResponse(c))
            .ToListAsync();

        return new PagedResult<CommentResponse>
        {
            Items = items,
            CurrentPage = pagination.Page,
            PageSize = pagination.PageSize,
            TotalCount = totalCount
        };
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

        var response = MapToResponse(comment);

        // Yorumun ait olduğu task'ın projectId'sini bul
        var task = await _context.TaskItems.FindAsync(taskItemId);
        if (task != null)
        {
            await _hubContext.Clients.Group($"project-{task.ProjectId}")
                .SendAsync("ReceiveNotification", new NotificationMessage
                {
                    Type = "CommentAdded",
                    Data = response,
                    ProjectId = task.ProjectId
                });
        }

        return response;
    }

    public async Task DeleteAsync(Guid id, Guid userId, UserRole userRole)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null) throw new NotFoundException("Yorum bulunamadı.");

        if (comment.AuthorId != userId && userRole != UserRole.Admin)
            throw new UnauthorizedException("Bu yorumu silme yetkiniz yok.");

        comment.IsDeleted = true;
        comment.DeletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
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
