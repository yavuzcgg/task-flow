using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Infrastructure.Data.Configurations;

public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(t => t.Description)
            .HasColumnType("text");

        builder.Property(t => t.Status)
            .IsRequired()
            .HasDefaultValue(TaskItemStatus.Todo);

        builder.Property(t => t.Priority)
            .IsRequired()
            .HasDefaultValue(TaskPriority.Medium);

        // TaskItem → Project : Cascade (proje silinirse görevler de silinir)
        builder.HasOne(t => t.Project)
            .WithMany(p => p.Tasks)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        // TaskItem → Assignee (User) : SetNull (kullanıcı silinirse assignee null olur)
        builder.HasOne(t => t.Assignee)
            .WithMany(u => u.AssignedTasks)
            .HasForeignKey(t => t.AssigneeId)
            .OnDelete(DeleteBehavior.SetNull);

        // TaskItem → Creator (User) : Restrict
        builder.HasOne(t => t.Creator)
            .WithMany(u => u.CreatedTasks)
            .HasForeignKey(t => t.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        // Index'ler
        builder.HasIndex(t => t.ProjectId);
        builder.HasIndex(t => t.AssigneeId);
        builder.HasIndex(t => t.Status);
    }
}
