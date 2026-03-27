namespace TaskFlow.Application.DTOs.Comment;

public class CommentResponse
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid TaskItemId { get; set; }
    public Guid AuthorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
