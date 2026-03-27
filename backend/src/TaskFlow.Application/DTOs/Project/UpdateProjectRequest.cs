namespace TaskFlow.Application.DTOs.Project;

public class UpdateProjectRequest
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsPublic { get; set; } = true;
}
