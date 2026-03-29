using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using TaskFlow.Application.DTOs.Project;
using TaskFlow.Application.Exceptions;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;
using TaskFlow.Infrastructure.Data;
using TaskFlow.Infrastructure.Hubs;
using TaskFlow.Infrastructure.Services;

namespace TaskFlow.UnitTests.Services;

public class ProjectServiceTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly ProjectService _projectService;
    private readonly Guid _ownerId = Guid.NewGuid();
    private readonly Guid _otherUserId = Guid.NewGuid();

    public ProjectServiceTests()
    {
        // Her test için temiz in-memory veritabanı
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _projectService = new ProjectService(_context);
    }

    [Fact]
    public async Task CreateAsync_ValidRequest_ReturnsProjectResponse()
    {
        // Arrange
        var request = new CreateProjectRequest
        {
            Name = "Test Project",
            Description = "Test açıklaması"
        };

        // Act
        var result = await _projectService.CreateAsync(request, _ownerId);

        // Assert
        Assert.Equal("Test Project", result.Name);
        Assert.Equal("Test açıklaması", result.Description);
        Assert.Equal(_ownerId, result.OwnerId);
        Assert.True(result.IsPublic);
    }

    [Fact]
    public async Task GetByIdAsync_ExistingProject_ReturnsProject()
    {
        // Arrange
        var project = new Project
        {
            Name = "Existing Project",
            OwnerId = _ownerId
        };
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        // Act
        var result = await _projectService.GetByIdAsync(project.Id);

        // Assert
        Assert.Equal("Existing Project", result.Name);
        Assert.Equal(project.Id, result.Id);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistentId_ThrowsNotFoundException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _projectService.GetByIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task DeleteAsync_Owner_DeletesSuccessfully()
    {
        // Arrange
        var project = new Project { Name = "My Project", OwnerId = _ownerId };
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        // Act — owner kendi projesini siliyor
        await _projectService.DeleteAsync(project.Id, _ownerId, UserRole.Developer);

        // Assert — soft delete olmuş mu?
        var deleted = await _context.Projects
            .IgnoreQueryFilters()
            .FirstAsync(p => p.Id == project.Id);
        Assert.True(deleted.IsDeleted);
        Assert.NotNull(deleted.DeletedAt);
    }

    [Fact]
    public async Task DeleteAsync_NonOwner_ThrowsUnauthorizedException()
    {
        // Arrange
        var project = new Project { Name = "Someone's Project", OwnerId = _ownerId };
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        // Act & Assert — başka biri silmeye çalışıyor
        await Assert.ThrowsAsync<UnauthorizedException>(
            () => _projectService.DeleteAsync(project.Id, _otherUserId, UserRole.Developer));
    }

    [Fact]
    public async Task DeleteAsync_Admin_CanDeleteAnyProject()
    {
        // Arrange
        var project = new Project { Name = "Any Project", OwnerId = _ownerId };
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        // Act — Admin başkasının projesini siliyor
        await _projectService.DeleteAsync(project.Id, _otherUserId, UserRole.Admin);

        // Assert
        var deleted = await _context.Projects
            .IgnoreQueryFilters()
            .FirstAsync(p => p.Id == project.Id);
        Assert.True(deleted.IsDeleted);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
