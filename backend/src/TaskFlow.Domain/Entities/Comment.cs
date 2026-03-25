namespace TaskFlow.Domain.Entities;

public class Comment : BaseEntity
{
    public required string Content { get; set; }

    // Foreign Keys
    public Guid TaskItemId { get; set; }
    public Guid AuthorId { get; set; }

    // Navigation Properties
    public TaskItem TaskItem { get; set; } = null!;
    public User Author { get; set; } = null!;
}
