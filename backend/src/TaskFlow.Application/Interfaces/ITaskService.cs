using TaskFlow.Application.DTOs.TaskItem;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskResponse>> GetByProjectAsync(Guid projectId);
    Task<TaskResponse> GetByIdAsync(Guid id);
    Task<TaskResponse> CreateAsync(Guid projectId, CreateTaskRequest request, Guid userId);
    Task<TaskResponse> UpdateAsync(Guid id, UpdateTaskRequest request);
    Task<TaskResponse> UpdateStatusAsync(Guid id, UpdateTaskStatusRequest request);
    Task DeleteAsync(Guid id, Guid userId, UserRole userRole);
}
