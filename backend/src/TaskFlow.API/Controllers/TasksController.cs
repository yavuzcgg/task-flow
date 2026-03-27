using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.DTOs.TaskItem;
using TaskFlow.Application.Interfaces;

namespace TaskFlow.API.Controllers;

[ApiController]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet("api/v1/projects/{projectId:guid}/tasks")]
    [ProducesResponseType(typeof(IEnumerable<TaskResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByProject(Guid projectId)
    {
        var tasks = await _taskService.GetByProjectAsync(projectId);
        return Ok(tasks);
    }

    [HttpGet("api/v1/tasks/{id:guid}")]
    [ProducesResponseType(typeof(TaskResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var task = await _taskService.GetByIdAsync(id);
        if (task == null)
            return NotFound(new { message = "Görev bulunamadı." });

        return Ok(task);
    }

    [HttpPost("api/v1/projects/{projectId:guid}/tasks")]
    [ProducesResponseType(typeof(TaskResponse), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create(Guid projectId, [FromBody] CreateTaskRequest request)
    {
        var userId = GetCurrentUserId();
        var task = await _taskService.CreateAsync(projectId, request, userId);
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    [HttpPut("api/v1/tasks/{id:guid}")]
    [ProducesResponseType(typeof(TaskResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskRequest request)
    {
        var task = await _taskService.UpdateAsync(id, request);
        if (task == null)
            return NotFound(new { message = "Görev bulunamadı." });

        return Ok(task);
    }

    [HttpPatch("api/v1/tasks/{id:guid}/status")]
    [ProducesResponseType(typeof(TaskResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateTaskStatusRequest request)
    {
        var task = await _taskService.UpdateStatusAsync(id, request);
        if (task == null)
            return NotFound(new { message = "Görev bulunamadı." });

        return Ok(task);
    }

    [HttpDelete("api/v1/tasks/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _taskService.DeleteAsync(id);
        if (!result)
            return NotFound(new { message = "Görev bulunamadı." });

        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                       ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim!.Value);
    }
}
