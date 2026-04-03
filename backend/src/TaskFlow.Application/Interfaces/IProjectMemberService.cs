using TaskFlow.Application.DTOs.ProjectInvitation;
using TaskFlow.Application.DTOs.ProjectMember;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Interfaces;

public interface IProjectMemberService
{
    Task<List<ProjectMemberResponse>> GetMembersByProjectAsync(Guid projectId, Guid requestingUserId);
    Task<InvitationResponse> InviteAsync(Guid projectId, InviteToProjectRequest request, Guid invitedByUserId);
    Task<InvitationResponse> RespondAsync(Guid invitationId, bool accept, Guid userId);
    Task CancelInvitationAsync(Guid invitationId, Guid userId);
    Task RemoveMemberAsync(Guid projectId, Guid memberUserId, Guid requestingUserId);
    Task UpdateMemberRoleAsync(Guid projectId, Guid memberUserId, ProjectRole newRole, Guid requestingUserId);
    Task<List<InvitationResponse>> GetPendingInvitationsForUserAsync(Guid userId);
    Task<bool> HasAccessAsync(Guid projectId, Guid userId);
}
