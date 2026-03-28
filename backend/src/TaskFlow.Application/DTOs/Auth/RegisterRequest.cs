using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.DTOs.Auth;

public class RegisterRequest
{
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public UserRole Role { get; set; } = UserRole.Developer;
}
