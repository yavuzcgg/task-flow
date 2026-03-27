using TaskFlow.Application.DTOs.TaskItem;

namespace TaskFlow.Application.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskResponse>> GetByProjectAsync(Guid projectId);
    Task<TaskResponse?> GetByIdAsync(Guid id);
    Task<TaskResponse> CreateAsync(Guid projectId, CreateTaskRequest request, Guid userId);
    Task<TaskResponse?> UpdateAsync(Guid id, UpdateTaskRequest request);
    Task<TaskResponse?> UpdateStatusAsync(Guid id, UpdateTaskStatusRequest request);
    Task<bool> DeleteAsync(Guid id);
}
