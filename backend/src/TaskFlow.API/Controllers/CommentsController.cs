using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.DTOs.Comment;
using TaskFlow.Application.Interfaces;
using TaskFlow.Domain.Enums;

namespace TaskFlow.API.Controllers;

[ApiController]
[Authorize]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet("api/v1/tasks/{taskId:guid}/comments")]
    [ProducesResponseType(typeof(IEnumerable<CommentResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByTask(Guid taskId)
    {
        var comments = await _commentService.GetByTaskAsync(taskId);
        return Ok(comments);
    }

    [HttpPost("api/v1/tasks/{taskId:guid}/comments")]
    [ProducesResponseType(typeof(CommentResponse), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create(Guid taskId, [FromBody] CreateCommentRequest request)
    {
        var userId = GetCurrentUserId();
        var comment = await _commentService.CreateAsync(taskId, request, userId);
        return StatusCode(StatusCodes.Status201Created, comment);
    }

    [HttpDelete("api/v1/comments/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _commentService.DeleteAsync(id, GetCurrentUserId(), GetCurrentUserRole());
        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                       ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim!.Value);
    }

    private UserRole GetCurrentUserRole()
    {
        var roleClaim = User.FindFirst(ClaimTypes.Role);
        return Enum.Parse<UserRole>(roleClaim?.Value ?? "Developer");
    }
}
