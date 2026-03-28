using TaskFlow.Application.DTOs.Common;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.DTOs.TaskItem;

public class TaskFilterParams : PaginationParams
{
    public TaskItemStatus? Status { get; set; }
    public TaskPriority? Priority { get; set; }
    public string? Search { get; set; }
}
