using TaskFlow.Application.DTOs.Comment;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Interfaces;

public interface ICommentService
{
    Task<IEnumerable<CommentResponse>> GetByTaskAsync(Guid taskItemId);
    Task<CommentResponse> CreateAsync(Guid taskItemId, CreateCommentRequest request, Guid userId);
    Task DeleteAsync(Guid id, Guid userId, UserRole userRole);
}
