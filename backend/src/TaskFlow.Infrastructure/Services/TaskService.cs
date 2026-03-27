using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs.TaskItem;
using TaskFlow.Application.Interfaces;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskResponse>> GetByProjectAsync(Guid projectId)
    {
        return await _context.TaskItems
            .Where(t => t.ProjectId == projectId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => MapToResponse(t))
            .ToListAsync();
    }

    public async Task<TaskResponse?> GetByIdAsync(Guid id)
    {
        var task = await _context.TaskItems.FindAsync(id);
        return task == null ? null : MapToResponse(task);
    }

    public async Task<TaskResponse> CreateAsync(Guid projectId, CreateTaskRequest request, Guid userId)
    {
        var task = new Domain.Entities.TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            AssigneeId = request.AssigneeId,
            DueDate = request.DueDate,
            ProjectId = projectId,
            CreatedById = userId,
            CreatedBy = userId
        };

        _context.TaskItems.Add(task);
        await _context.SaveChangesAsync();

        return MapToResponse(task);
    }

    public async Task<TaskResponse?> UpdateAsync(Guid id, UpdateTaskRequest request)
    {
        var task = await _context.TaskItems.FindAsync(id);
        if (task == null) return null;

        task.Title = request.Title;
        task.Description = request.Description;
        task.Priority = request.Priority;
        task.AssigneeId = request.AssigneeId;
        task.DueDate = request.DueDate;

        await _context.SaveChangesAsync();

        return MapToResponse(task);
    }

    public async Task<TaskResponse?> UpdateStatusAsync(Guid id, UpdateTaskStatusRequest request)
    {
        var task = await _context.TaskItems.FindAsync(id);
        if (task == null) return null;

        task.Status = request.Status;

        await _context.SaveChangesAsync();

        return MapToResponse(task);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var task = await _context.TaskItems.FindAsync(id);
        if (task == null) return false;

        task.IsDeleted = true;
        task.DeletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    private static TaskResponse MapToResponse(Domain.Entities.TaskItem task)
    {
        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status.ToString(),
            Priority = task.Priority.ToString(),
            ProjectId = task.ProjectId,
            AssigneeId = task.AssigneeId,
            CreatedById = task.CreatedById,
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };
    }
}
