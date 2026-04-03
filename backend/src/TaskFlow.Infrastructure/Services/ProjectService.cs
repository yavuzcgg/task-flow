using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs.Common;
using TaskFlow.Application.DTOs.Project;
using TaskFlow.Application.Exceptions;
using TaskFlow.Application.Interfaces;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;

    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<ProjectResponse>> GetAllByUserAsync(Guid userId, PaginationParams pagination)
    {
        var query = _context.Projects
            .Where(p => p.Members.Any(m => m.UserId == userId))
            .OrderByDescending(p => p.CreatedAt);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .Select(p => new ProjectResponse
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                IsPublic = p.IsPublic,
                OwnerId = p.OwnerId,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                UserRole = p.Members
                    .Where(m => m.UserId == userId)
                    .Select(m => m.Role.ToString())
                    .FirstOrDefault(),
                MemberCount = p.Members.Count
            })
            .ToListAsync();

        return new PagedResult<ProjectResponse>
        {
            Items = items,
            CurrentPage = pagination.Page,
            PageSize = pagination.PageSize,
            TotalCount = totalCount
        };
    }

    public async Task<ProjectResponse> GetByIdAsync(Guid id, Guid userId)
    {
        var project = await _context.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (project == null) throw new NotFoundException("Proje bulunamadı.");

        var response = MapToResponse(project);
        response.MemberCount = project.Members.Count;
        response.UserRole = project.Members
            .FirstOrDefault(m => m.UserId == userId)?.Role.ToString();
        return response;
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

        // Owner'ı otomatik olarak ProjectMember tablosuna ekle
        var ownerMember = new ProjectMember
        {
            ProjectId = project.Id,
            UserId = userId,
            Role = ProjectRole.Owner,
            CreatedBy = userId
        };
        _context.ProjectMembers.Add(ownerMember);

        await _context.SaveChangesAsync();

        var response = MapToResponse(project);
        response.UserRole = ProjectRole.Owner.ToString();
        response.MemberCount = 1;
        return response;
    }

    public async Task<ProjectResponse> UpdateAsync(Guid id, UpdateProjectRequest request, Guid userId, UserRole userRole)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) throw new NotFoundException("Proje bulunamadı.");

        // Sistem Admin'i veya proje Owner/Admin'i güncelleme yapabilir
        if (userRole != UserRole.Admin)
        {
            var projectRole = await _context.ProjectMembers
                .Where(pm => pm.ProjectId == id && pm.UserId == userId)
                .Select(pm => (ProjectRole?)pm.Role)
                .FirstOrDefaultAsync();

            if (projectRole is not (ProjectRole.Owner or ProjectRole.Admin))
                throw new UnauthorizedException("Bu projeyi güncelleme yetkiniz yok.");
        }

        project.Name = request.Name;
        project.Description = request.Description;
        project.IsPublic = request.IsPublic;
        project.UpdatedBy = userId;

        await _context.SaveChangesAsync();

        return MapToResponse(project);
    }

    public async Task DeleteAsync(Guid id, Guid userId, UserRole userRole)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) throw new NotFoundException("Proje bulunamadı.");

        // Sadece sistem Admin'i veya proje Owner'ı silebilir
        if (userRole != UserRole.Admin)
        {
            var projectRole = await _context.ProjectMembers
                .Where(pm => pm.ProjectId == id && pm.UserId == userId)
                .Select(pm => (ProjectRole?)pm.Role)
                .FirstOrDefaultAsync();

            if (projectRole != ProjectRole.Owner)
                throw new UnauthorizedException("Bu projeyi silme yetkiniz yok.");
        }

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
