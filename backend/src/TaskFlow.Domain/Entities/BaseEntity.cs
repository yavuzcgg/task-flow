namespace TaskFlow.Domain.Entities;

public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Audit Trail
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    // Soft Delete
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }

    // Soft Disable
    public bool IsActive { get; set; } = true;
    public DateTime? DeactivatedAt { get; set; }
}
