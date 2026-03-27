using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.DTOs.TaskItem;

public class UpdateTaskRequest
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; }
    public Guid? AssigneeId { get; set; }
    public DateTime? DueDate { get; set; }
}
