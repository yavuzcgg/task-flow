using TaskFlow.Application.DTOs.Comment;
using TaskFlow.Application.DTOs.Common;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Interfaces;

public interface ICommentService
{
    Task<PagedResult<CommentResponse>> GetByTaskAsync(Guid taskItemId, PaginationParams pagination);
    Task<CommentResponse> CreateAsync(Guid taskItemId, CreateCommentRequest request, Guid userId);
    Task DeleteAsync(Guid id, Guid userId, UserRole userRole);
}
