using TaskFlow.Application.DTOs.Comment;

namespace TaskFlow.Application.Interfaces;

public interface ICommentService
{
    Task<IEnumerable<CommentResponse>> GetByTaskAsync(Guid taskItemId);
    Task<CommentResponse> CreateAsync(Guid taskItemId, CreateCommentRequest request, Guid userId);
    Task<bool> DeleteAsync(Guid id);
}
