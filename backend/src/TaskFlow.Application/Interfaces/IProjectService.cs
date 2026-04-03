using TaskFlow.Application.DTOs.Common;
using TaskFlow.Application.DTOs.Project;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Interfaces;

public interface IProjectService
{
    Task<PagedResult<ProjectResponse>> GetAllByUserAsync(Guid userId, PaginationParams pagination);
    Task<ProjectResponse> GetByIdAsync(Guid id, Guid userId);
    Task<ProjectResponse> CreateAsync(CreateProjectRequest request, Guid userId);
    Task<ProjectResponse> UpdateAsync(Guid id, UpdateProjectRequest request, Guid userId, UserRole userRole);
    Task DeleteAsync(Guid id, Guid userId, UserRole userRole);
}
