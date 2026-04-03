using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.DTOs.ProjectMember;

public class UpdateMemberRoleRequest
{
    public ProjectRole Role { get; set; }
}
