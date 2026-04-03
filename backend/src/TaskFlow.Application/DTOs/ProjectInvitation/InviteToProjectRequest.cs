using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.DTOs.ProjectInvitation;

public class InviteToProjectRequest
{
    public required string Email { get; set; }
    public ProjectRole Role { get; set; } = ProjectRole.Member;
}
