using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}
