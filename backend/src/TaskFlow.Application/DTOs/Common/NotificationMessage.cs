namespace TaskFlow.Application.DTOs.Common;

public class NotificationMessage
{
    public string Type { get; set; } = string.Empty;
    public object? Data { get; set; }
    public Guid ProjectId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
