using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.DTOs.ProjectInvitation;
using TaskFlow.Application.Interfaces;

namespace TaskFlow.API.Controllers;

[ApiController]
[Authorize]
public class InvitationsController : ControllerBase
{
    private readonly IProjectMemberService _memberService;

    public InvitationsController(IProjectMemberService memberService)
    {
        _memberService = memberService;
    }

    [HttpPost("api/v1/projects/{projectId:guid}/invitations")]
    [ProducesResponseType(typeof(InvitationResponse), StatusCodes.Status201Created)]
    public async Task<IActionResult> Invite(Guid projectId, [FromBody] InviteToProjectRequest request)
    {
        var invitation = await _memberService.InviteAsync(projectId, request, GetCurrentUserId());
        return StatusCode(StatusCodes.Status201Created, invitation);
    }

    [HttpGet("api/v1/invitations/pending")]
    [ProducesResponseType(typeof(List<InvitationResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPending()
    {
        var invitations = await _memberService.GetPendingInvitationsForUserAsync(GetCurrentUserId());
        return Ok(invitations);
    }

    [HttpPost("api/v1/invitations/{id:guid}/respond")]
    [ProducesResponseType(typeof(InvitationResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Respond(Guid id, [FromBody] RespondToInvitationRequest request)
    {
        var invitation = await _memberService.RespondAsync(id, request.Accept, GetCurrentUserId());
        return Ok(invitation);
    }

    [HttpDelete("api/v1/invitations/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Cancel(Guid id)
    {
        await _memberService.CancelInvitationAsync(id, GetCurrentUserId());
        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                       ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim!.Value);
    }
}
