using TaskFlow.Application.DTOs.Common;
using TaskFlow.Application.DTOs.TaskItem;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Interfaces;

public interface ITaskService
{
    Task<PagedResult<TaskResponse>> GetByProjectAsync(Guid projectId, TaskFilterParams filter);
    Task<TaskResponse> GetByIdAsync(Guid id);
    Task<TaskResponse> CreateAsync(Guid projectId, CreateTaskRequest request, Guid userId);
    Task<TaskResponse> UpdateAsync(Guid id, UpdateTaskRequest request);
    Task<TaskResponse> UpdateStatusAsync(Guid id, UpdateTaskStatusRequest request);
    Task DeleteAsync(Guid id, Guid userId, UserRole userRole);
}
