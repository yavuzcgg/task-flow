using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Infrastructure.Data.Configurations;

public class ProjectInvitationConfiguration : IEntityTypeConfiguration<ProjectInvitation>
{
    public void Configure(EntityTypeBuilder<ProjectInvitation> builder)
    {
        builder.HasKey(pi => pi.Id);

        builder.HasIndex(pi => new { pi.InvitedUserId, pi.Status });

        builder.Property(pi => pi.InvitedEmail)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(pi => pi.Role)
            .IsRequired()
            .HasDefaultValue(ProjectRole.Member);

        builder.Property(pi => pi.Status)
            .IsRequired()
            .HasDefaultValue(InvitationStatus.Pending);

        // ProjectInvitation → Project : Restrict
        builder.HasOne(pi => pi.Project)
            .WithMany(p => p.Invitations)
            .HasForeignKey(pi => pi.ProjectId)
            .OnDelete(DeleteBehavior.Restrict);

        // ProjectInvitation → InvitedByUser : Restrict
        builder.HasOne(pi => pi.InvitedByUser)
            .WithMany(u => u.SentInvitations)
            .HasForeignKey(pi => pi.InvitedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // ProjectInvitation → InvitedUser : Restrict
        builder.HasOne(pi => pi.InvitedUser)
            .WithMany(u => u.ReceivedInvitations)
            .HasForeignKey(pi => pi.InvitedUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
