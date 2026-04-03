using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs.ProjectInvitation;
using TaskFlow.Application.DTOs.ProjectMember;
using TaskFlow.Application.Exceptions;
using TaskFlow.Application.Interfaces;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;
using TaskFlow.Infrastructure.Data;
using TaskFlow.Infrastructure.Hubs;

namespace TaskFlow.Infrastructure.Services;

public class ProjectMemberService : IProjectMemberService
{
    private readonly AppDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly IHubContext<TaskHub> _hubContext;

    public ProjectMemberService(AppDbContext context, UserManager<User> userManager, IHubContext<TaskHub> hubContext)
    {
        _context = context;
        _userManager = userManager;
        _hubContext = hubContext;
    }

    public async Task<List<ProjectMemberResponse>> GetMembersByProjectAsync(Guid projectId, Guid requestingUserId)
    {
        var hasAccess = await HasAccessAsync(projectId, requestingUserId);
        if (!hasAccess)
            throw new UnauthorizedException("Bu projenin üyelerini görme yetkiniz yok.");

        return await _context.ProjectMembers
            .Where(pm => pm.ProjectId == projectId)
            .Include(pm => pm.User)
            .Select(pm => new ProjectMemberResponse
            {
                Id = pm.Id,
                ProjectId = pm.ProjectId,
                UserId = pm.UserId,
                UserFullName = pm.User.FullName,
                UserEmail = pm.User.Email!,
                Role = pm.Role.ToString(),
                JoinedAt = pm.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<InvitationResponse> InviteAsync(Guid projectId, InviteToProjectRequest request, Guid invitedByUserId)
    {
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null)
            throw new NotFoundException("Proje bulunamadı.");

        // Davet eden kişinin yetkisini kontrol et (Owner veya Admin olmalı)
        var inviterRole = await GetUserRoleInProjectAsync(projectId, invitedByUserId);
        if (inviterRole is not (ProjectRole.Owner or ProjectRole.Admin))
            throw new UnauthorizedException("Bu projeye kullanıcı davet etme yetkiniz yok.");

        // Davet edilen kullanıcıyı bul
        var invitedUser = await _userManager.FindByEmailAsync(request.Email);
        if (invitedUser == null)
            throw new NotFoundException("Bu e-posta adresine kayıtlı kullanıcı bulunamadı.");

        // Kendini davet edemezsin
        if (invitedUser.Id == invitedByUserId)
            throw new BadRequestException("Kendinizi davet edemezsiniz.");

        // Zaten üye mi?
        var isAlreadyMember = await _context.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == invitedUser.Id);
        if (isAlreadyMember)
            throw new BadRequestException("Bu kullanıcı zaten projenin üyesi.");

        // Zaten bekleyen davet var mı?
        var hasPendingInvitation = await _context.ProjectInvitations
            .AnyAsync(pi => pi.ProjectId == projectId
                         && pi.InvitedUserId == invitedUser.Id
                         && pi.Status == InvitationStatus.Pending);
        if (hasPendingInvitation)
            throw new BadRequestException("Bu kullanıcıya zaten bekleyen bir davet gönderilmiş.");

        var invitedByUser = await _userManager.FindByIdAsync(invitedByUserId.ToString());

        var invitation = new ProjectInvitation
        {
            ProjectId = projectId,
            InvitedByUserId = invitedByUserId,
            InvitedUserId = invitedUser.Id,
            InvitedEmail = request.Email,
            Role = request.Role,
            Status = InvitationStatus.Pending,
            CreatedBy = invitedByUserId
        };

        _context.ProjectInvitations.Add(invitation);
        await _context.SaveChangesAsync();

        // SignalR ile bildirim gönder
        await _hubContext.Clients.Group($"user-{invitedUser.Id}")
            .SendAsync("InvitationReceived", new
            {
                InvitationId = invitation.Id,
                ProjectName = project.Name,
                InvitedByUserName = invitedByUser?.FullName ?? "Bilinmeyen",
                Role = request.Role.ToString()
            });

        return new InvitationResponse
        {
            Id = invitation.Id,
            ProjectId = projectId,
            ProjectName = project.Name,
            InvitedByUserName = invitedByUser?.FullName ?? "",
            InvitedEmail = request.Email,
            Role = invitation.Role.ToString(),
            Status = invitation.Status.ToString(),
            CreatedAt = invitation.CreatedAt
        };
    }

    public async Task<InvitationResponse> RespondAsync(Guid invitationId, bool accept, Guid userId)
    {
        var invitation = await _context.ProjectInvitations
            .Include(pi => pi.Project)
            .Include(pi => pi.InvitedByUser)
            .FirstOrDefaultAsync(pi => pi.Id == invitationId);

        if (invitation == null)
            throw new NotFoundException("Davet bulunamadı.");

        if (invitation.InvitedUserId != userId)
            throw new UnauthorizedException("Bu davete yanıt verme yetkiniz yok.");

        if (invitation.Status != InvitationStatus.Pending)
            throw new BadRequestException("Bu davet zaten yanıtlanmış.");

        invitation.Status = accept ? InvitationStatus.Accepted : InvitationStatus.Rejected;
        invitation.RespondedAt = DateTime.UtcNow;
        invitation.UpdatedBy = userId;

        if (accept)
        {
            var member = new ProjectMember
            {
                ProjectId = invitation.ProjectId,
                UserId = userId,
                Role = invitation.Role,
                CreatedBy = userId
            };
            _context.ProjectMembers.Add(member);
        }

        await _context.SaveChangesAsync();

        // Davet edene bildirim gönder
        await _hubContext.Clients.Group($"user-{invitation.InvitedByUserId}")
            .SendAsync("InvitationResponded", new
            {
                InvitationId = invitation.Id,
                ProjectName = invitation.Project.Name,
                Accepted = accept
            });

        return new InvitationResponse
        {
            Id = invitation.Id,
            ProjectId = invitation.ProjectId,
            ProjectName = invitation.Project.Name,
            InvitedByUserName = invitation.InvitedByUser.FullName,
            InvitedEmail = invitation.InvitedEmail,
            Role = invitation.Role.ToString(),
            Status = invitation.Status.ToString(),
            CreatedAt = invitation.CreatedAt
        };
    }

    public async Task CancelInvitationAsync(Guid invitationId, Guid userId)
    {
        var invitation = await _context.ProjectInvitations.FindAsync(invitationId);
        if (invitation == null)
            throw new NotFoundException("Davet bulunamadı.");

        if (invitation.InvitedByUserId != userId)
        {
            // Proje Owner/Admin da iptal edebilir
            var role = await GetUserRoleInProjectAsync(invitation.ProjectId, userId);
            if (role is not (ProjectRole.Owner or ProjectRole.Admin))
                throw new UnauthorizedException("Bu daveti iptal etme yetkiniz yok.");
        }

        if (invitation.Status != InvitationStatus.Pending)
            throw new BadRequestException("Sadece bekleyen davetler iptal edilebilir.");

        invitation.Status = InvitationStatus.Cancelled;
        invitation.UpdatedBy = userId;
        await _context.SaveChangesAsync();
    }

    public async Task RemoveMemberAsync(Guid projectId, Guid memberUserId, Guid requestingUserId)
    {
        var requesterRole = await GetUserRoleInProjectAsync(projectId, requestingUserId);
        if (requesterRole is not (ProjectRole.Owner or ProjectRole.Admin))
            throw new UnauthorizedException("Üye çıkarma yetkiniz yok.");

        var member = await _context.ProjectMembers
            .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == memberUserId);
        if (member == null)
            throw new NotFoundException("Üye bulunamadı.");

        if (member.Role == ProjectRole.Owner)
            throw new BadRequestException("Proje sahibi çıkarılamaz.");

        // Admin, başka bir Admin'i çıkaramaz — sadece Owner çıkarabilir
        if (member.Role == ProjectRole.Admin && requesterRole != ProjectRole.Owner)
            throw new UnauthorizedException("Admin üyeleri sadece proje sahibi çıkarabilir.");

        member.IsDeleted = true;
        member.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task UpdateMemberRoleAsync(Guid projectId, Guid memberUserId, ProjectRole newRole, Guid requestingUserId)
    {
        if (newRole == ProjectRole.Owner)
            throw new BadRequestException("Owner rolü atanamaz.");

        var requesterRole = await GetUserRoleInProjectAsync(projectId, requestingUserId);
        if (requesterRole != ProjectRole.Owner)
            throw new UnauthorizedException("Üye rolünü sadece proje sahibi değiştirebilir.");

        var member = await _context.ProjectMembers
            .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == memberUserId);
        if (member == null)
            throw new NotFoundException("Üye bulunamadı.");

        if (member.Role == ProjectRole.Owner)
            throw new BadRequestException("Proje sahibinin rolü değiştirilemez.");

        member.Role = newRole;
        member.UpdatedBy = requestingUserId;
        await _context.SaveChangesAsync();
    }

    public async Task<List<InvitationResponse>> GetPendingInvitationsForUserAsync(Guid userId)
    {
        return await _context.ProjectInvitations
            .Where(pi => pi.InvitedUserId == userId && pi.Status == InvitationStatus.Pending)
            .Include(pi => pi.Project)
            .Include(pi => pi.InvitedByUser)
            .OrderByDescending(pi => pi.CreatedAt)
            .Select(pi => new InvitationResponse
            {
                Id = pi.Id,
                ProjectId = pi.ProjectId,
                ProjectName = pi.Project.Name,
                InvitedByUserName = pi.InvitedByUser.FullName,
                InvitedEmail = pi.InvitedEmail,
                Role = pi.Role.ToString(),
                Status = pi.Status.ToString(),
                CreatedAt = pi.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<bool> HasAccessAsync(Guid projectId, Guid userId)
    {
        return await _context.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == userId);
    }

    private async Task<ProjectRole?> GetUserRoleInProjectAsync(Guid projectId, Guid userId)
    {
        var member = await _context.ProjectMembers
            .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == userId);
        return member?.Role;
    }
}
