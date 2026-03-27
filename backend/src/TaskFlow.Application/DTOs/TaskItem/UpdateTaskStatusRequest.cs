using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.DTOs.TaskItem;

public class UpdateTaskStatusRequest
{
    public TaskItemStatus Status { get; set; }
}
