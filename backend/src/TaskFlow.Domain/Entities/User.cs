using TaskFlow.Domain.Enums;

namespace TaskFlow.Domain.Entities;

public class User : BaseEntity
{
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public UserRole Role { get; set; } = UserRole.Developer;
    public string? ProfileImageUrl { get; set; }

    // Navigation Properties
    public ICollection<Project> OwnedProjects { get; set; } = new List<Project>();
    public ICollection<TaskItem> AssignedTasks { get; set; } = new List<TaskItem>();
    public ICollection<TaskItem> CreatedTasks { get; set; } = new List<TaskItem>(); // TaskItem.Creator ile eşleşir
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
