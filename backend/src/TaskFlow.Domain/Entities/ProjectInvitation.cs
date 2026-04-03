using TaskFlow.Domain.Enums;

namespace TaskFlow.Domain.Entities;

public class ProjectInvitation : BaseEntity
{
    public Guid ProjectId { get; set; }
    public Guid InvitedByUserId { get; set; }
    public Guid InvitedUserId { get; set; }
    public required string InvitedEmail { get; set; }
    public ProjectRole Role { get; set; } = ProjectRole.Member;
    public InvitationStatus Status { get; set; } = InvitationStatus.Pending;
    public DateTime? RespondedAt { get; set; }

    // Navigation Properties
    public Project Project { get; set; } = null!;
    public User InvitedByUser { get; set; } = null!;
    public User InvitedUser { get; set; } = null!;
}
