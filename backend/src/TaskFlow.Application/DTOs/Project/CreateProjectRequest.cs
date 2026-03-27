namespace TaskFlow.Application.DTOs.Project;

public class CreateProjectRequest
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}
