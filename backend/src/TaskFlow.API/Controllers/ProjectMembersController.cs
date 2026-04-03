using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.DTOs.ProjectMember;
using TaskFlow.Application.Interfaces;

namespace TaskFlow.API.Controllers;

[ApiController]
[Route("api/v1/projects/{projectId:guid}/members")]
[Authorize]
public class ProjectMembersController : ControllerBase
{
    private readonly IProjectMemberService _memberService;

    public ProjectMembersController(IProjectMemberService memberService)
    {
        _memberService = memberService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<ProjectMemberResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMembers(Guid projectId)
    {
        var members = await _memberService.GetMembersByProjectAsync(projectId, GetCurrentUserId());
        return Ok(members);
    }

    [HttpDelete("{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> RemoveMember(Guid projectId, Guid userId)
    {
        await _memberService.RemoveMemberAsync(projectId, userId, GetCurrentUserId());
        return NoContent();
    }

    [HttpPut("{userId:guid}/role")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> UpdateRole(Guid projectId, Guid userId, [FromBody] UpdateMemberRoleRequest request)
    {
        await _memberService.UpdateMemberRoleAsync(projectId, userId, request.Role, GetCurrentUserId());
        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                       ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim!.Value);
    }
}
