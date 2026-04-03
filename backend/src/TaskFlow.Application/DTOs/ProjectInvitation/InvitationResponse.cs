namespace TaskFlow.Application.DTOs.ProjectInvitation;

public class InvitationResponse
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string InvitedByUserName { get; set; } = string.Empty;
    public string InvitedEmail { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
