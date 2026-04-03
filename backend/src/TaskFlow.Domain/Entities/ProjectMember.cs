using TaskFlow.Domain.Enums;

namespace TaskFlow.Domain.Entities;

public class ProjectMember : BaseEntity
{
    public Guid ProjectId { get; set; }
    public Guid UserId { get; set; }
    public ProjectRole Role { get; set; } = ProjectRole.Member;

    // Navigation Properties
    public Project Project { get; set; } = null!;
    public User User { get; set; } = null!;
}
