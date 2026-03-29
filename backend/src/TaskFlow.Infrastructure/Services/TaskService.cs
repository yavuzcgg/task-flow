using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs.Common;
using TaskFlow.Application.DTOs.TaskItem;
using TaskFlow.Application.Exceptions;
using TaskFlow.Application.Interfaces;
using TaskFlow.Domain.Enums;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<TaskFlow.Infrastructure.Hubs.TaskHub> _hubContext;

    public TaskService(AppDbContext context, IHubContext<TaskFlow.Infrastructure.Hubs.TaskHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task<PagedResult<TaskResponse>> GetByProjectAsync(Guid projectId, TaskFilterParams filter)
    {
        var query = _context.TaskItems
            .Where(t => t.ProjectId == projectId)
            .AsQueryable();

        if (filter.Status.HasValue)
            query = query.Where(t => t.Status == filter.Status.Value);

        if (filter.Priority.HasValue)
            query = query.Where(t => t.Priority == filter.Priority.Value);

        if (!string.IsNullOrWhiteSpace(filter.Search))
            query = query.Where(t => t.Title.Contains(filter.Search));

        query = query.OrderByDescending(t => t.CreatedAt);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(t => MapToResponse(t))
            .ToListAsync();

        return new PagedResult<TaskResponse>
        {
            Items = items,
            CurrentPage = filter.Page,
            PageSize = filter.PageSize,
            TotalCount = totalCount
        };
    }

    public async Task<TaskResponse> GetByIdAsync(Guid id)
    {
        var task = await _context.TaskItems.FindAsync(id);
        if (task == null) throw new NotFoundException("Görev bulunamadı.");

        return MapToResponse(task);
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

        var response = MapToResponse(task);

        await _hubContext.Clients.Group($"project-{projectId}")
            .SendAsync("ReceiveNotification", new NotificationMessage
            {
                Type = "TaskCreated",
                Data = response,
                ProjectId = projectId
            });

        return response;
    }

    public async Task<TaskResponse> UpdateAsync(Guid id, UpdateTaskRequest request)
    {
        var task = await _context.TaskItems.FindAsync(id);
        if (task == null) throw new NotFoundException("Görev bulunamadı.");

        task.Title = request.Title;
        task.Description = request.Description;
        task.Priority = request.Priority;
        task.AssigneeId = request.AssigneeId;
        task.DueDate = request.DueDate;

        await _context.SaveChangesAsync();

        return MapToResponse(task);
    }

    public async Task<TaskResponse> UpdateStatusAsync(Guid id, UpdateTaskStatusRequest request)
    {
        var task = await _context.TaskItems.FindAsync(id);
        if (task == null) throw new NotFoundException("Görev bulunamadı.");

        task.Status = request.Status;

        await _context.SaveChangesAsync();

        var response = MapToResponse(task);

        await _hubContext.Clients.Group($"project-{task.ProjectId}")
            .SendAsync("ReceiveNotification", new NotificationMessage
            {
                Type = "TaskStatusChanged",
                Data = response,
                ProjectId = task.ProjectId
            });

        return response;
    }

    public async Task DeleteAsync(Guid id, Guid userId, UserRole userRole)
    {
        var task = await _context.TaskItems.FindAsync(id);
        if (task == null) throw new NotFoundException("Görev bulunamadı.");

        if (task.CreatedById != userId && userRole != UserRole.Admin)
            throw new UnauthorizedException("Bu görevi silme yetkiniz yok.");

        var projectId = task.ProjectId;

        task.IsDeleted = true;
        task.DeletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _hubContext.Clients.Group($"project-{projectId}")
            .SendAsync("ReceiveNotification", new NotificationMessage
            {
                Type = "TaskDeleted",
                Data = new { Id = id },
                ProjectId = projectId
            });
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
