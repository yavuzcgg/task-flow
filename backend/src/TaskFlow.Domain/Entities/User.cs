using Microsoft.AspNetCore.Identity;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Domain.Entities;

public class User : IdentityUser<Guid>
{
    public required string FullName { get; set; }
    public UserRole Role { get; set; } = UserRole.Developer;
    public string? ProfileImageUrl { get; set; }

    // Audit Trail (IdentityUser'da yok, manuel ekliyoruz)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    // Soft Delete & Disable
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? DeactivatedAt { get; set; }

    // Navigation Properties
    public ICollection<Project> OwnedProjects { get; set; } = new List<Project>();
    public ICollection<TaskItem> AssignedTasks { get; set; } = new List<TaskItem>();
    public ICollection<TaskItem> CreatedTasks { get; set; } = new List<TaskItem>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<ProjectMember> ProjectMemberships { get; set; } = new List<ProjectMember>();
    public ICollection<ProjectInvitation> ReceivedInvitations { get; set; } = new List<ProjectInvitation>();
    public ICollection<ProjectInvitation> SentInvitations { get; set; } = new List<ProjectInvitation>();
}
