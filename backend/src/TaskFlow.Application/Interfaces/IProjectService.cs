using TaskFlow.Application.DTOs.Project;

namespace TaskFlow.Application.Interfaces;

public interface IProjectService
{
    Task<IEnumerable<ProjectResponse>> GetAllByUserAsync(Guid userId);
    Task<ProjectResponse?> GetByIdAsync(Guid id);
    Task<ProjectResponse> CreateAsync(CreateProjectRequest request, Guid userId);
    Task<ProjectResponse?> UpdateAsync(Guid id, UpdateProjectRequest request);
    Task<bool> DeleteAsync(Guid id);
}
