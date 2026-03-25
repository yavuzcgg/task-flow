namespace TaskFlow.Domain.Entities;

public class Project : BaseEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }

    // Foreign Key
    public Guid OwnerId { get; set; }

    // Navigation Properties
    public User Owner { get; set; } = null!;
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
