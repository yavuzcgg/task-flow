using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs.Project;
using TaskFlow.Application.Exceptions;
using TaskFlow.Application.Interfaces;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;

    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProjectResponse>> GetAllByUserAsync(Guid userId)
    {
        return await _context.Projects
            .Where(p => p.OwnerId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => MapToResponse(p))
            .ToListAsync();
    }

    public async Task<ProjectResponse> GetByIdAsync(Guid id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) throw new NotFoundException("Proje bulunamadı.");

        return MapToResponse(project);
    }

    public async Task<ProjectResponse> CreateAsync(CreateProjectRequest request, Guid userId)
    {
        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            OwnerId = userId,
            CreatedBy = userId
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return MapToResponse(project);
    }

    public async Task<ProjectResponse> UpdateAsync(Guid id, UpdateProjectRequest request)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) throw new NotFoundException("Proje bulunamadı.");

        project.Name = request.Name;
        project.Description = request.Description;
        project.IsPublic = request.IsPublic;

        await _context.SaveChangesAsync();

        return MapToResponse(project);
    }

    public async Task DeleteAsync(Guid id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) throw new NotFoundException("Proje bulunamadı.");

        project.IsDeleted = true;
        project.DeletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    private static ProjectResponse MapToResponse(Project project)
    {
        return new ProjectResponse
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            IsPublic = project.IsPublic,
            OwnerId = project.OwnerId,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt
        };
    }
}
