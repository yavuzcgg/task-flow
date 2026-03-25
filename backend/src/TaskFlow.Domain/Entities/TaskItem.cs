using TaskFlow.Domain.Enums;

namespace TaskFlow.Domain.Entities;

public class TaskItem : BaseEntity
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public DateTime? DueDate { get; set; }

    // Foreign Keys
    public Guid ProjectId { get; set; }
    public Guid? AssigneeId { get; set; }
    public Guid CreatedById { get; set; }

    // Navigation Properties
    public Project Project { get; set; } = null!;
    public User? Assignee { get; set; }
    public User CreatedBy { get; set; } = null!;
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
