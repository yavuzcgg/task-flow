using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace TaskFlow.Infrastructure.Hubs;

[Authorize]
public class TaskHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                  ?? Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId != null)
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");

        await base.OnConnectedAsync();
    }

    public async Task JoinProject(Guid projectId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"project-{projectId}");
    }

    public async Task LeaveProject(Guid projectId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"project-{projectId}");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}
