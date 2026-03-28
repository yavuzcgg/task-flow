using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.DTOs.Project;
using TaskFlow.Application.Interfaces;

namespace TaskFlow.API.Controllers;

[ApiController]
[Route("api/v1/projects")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProjectResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetCurrentUserId();
        var projects = await _projectService.GetAllByUserAsync(userId);
        return Ok(projects);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ProjectResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var project = await _projectService.GetByIdAsync(id);
        return Ok(project);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ProjectResponse), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateProjectRequest request)
    {
        var userId = GetCurrentUserId();
        var project = await _projectService.CreateAsync(request, userId);
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ProjectResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProjectRequest request)
    {
        var project = await _projectService.UpdateAsync(id, request);
        return Ok(project);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _projectService.DeleteAsync(id);
        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                       ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim!.Value);
    }
}
